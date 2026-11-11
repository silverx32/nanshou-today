// 记录都只保存在本机（localStorage），不上传任何地方

import { computed, reactive } from 'vue'
import { FIGURES, randomFigure } from './data/figures'
import { uid } from './utils'

export interface Entry {
  id: string
  createdAt: number
  updatedAt: number
  /** 事情发生的时间 */
  happenedAt: number
  /** 发生了什么事？ */
  situation: string
  /** 是什么想法引起了你的情绪？ */
  thought: string
  /** 圈出的情绪 */
  emotions: string[]
  /** 第一次打分 0-10 */
  before: number | null
  /** 还可以怎么看待这件事？ */
  reframe: string
  /** 第二次打分 0-10 */
  after: number | null
  /** 用过的情绪重启卡 */
  cards: string[]
  /** 陪伴这一页的小人 */
  buddy: string
}

export interface Draft {
  entry: Entry
  step: number
}

const ENTRIES_KEY = 'wjtynsl:entries:v1'
const DRAFT_KEY = 'wjtynsl:draft:v1'

// ---------- 读写 ----------
function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

/** 兜底整理一条记录，防止旧数据或导入的文件缺字段 */
function normalize(raw: unknown): Entry | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  if (typeof r.id !== 'string' || !r.id) return null
  const now = Date.now()
  const num = (v: unknown, d: number) => (typeof v === 'number' && Number.isFinite(v) ? v : d)
  const str = (v: unknown) => (typeof v === 'string' ? v : '')
  const score = (v: unknown) => (typeof v === 'number' && v >= 0 && v <= 10 ? Math.round(v) : null)
  const list = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [])
  const createdAt = num(r.createdAt, now)
  return {
    id: r.id,
    createdAt,
    updatedAt: num(r.updatedAt, createdAt),
    happenedAt: num(r.happenedAt, createdAt),
    situation: str(r.situation),
    thought: str(r.thought),
    emotions: list(r.emotions),
    before: score(r.before),
    reframe: str(r.reframe),
    after: score(r.after),
    cards: list(r.cards),
    buddy: typeof r.buddy === 'string' && r.buddy in FIGURES ? r.buddy : 'rabbit',
  }
}

const state = reactive({
  entries: read<unknown[]>(ENTRIES_KEY, [])
    .map(normalize)
    .filter((e): e is Entry => e !== null),
  draft: read<Draft | null>(DRAFT_KEY, null),
})

if (state.draft) {
  const entry = normalize(state.draft.entry)
  state.draft = entry ? { entry, step: Number(state.draft.step) || 0 } : null
}

function persist() {
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(state.entries))
}

let askedPersist = false
function askPersistentStorage() {
  if (askedPersist) return
  askedPersist = true
  navigator.storage?.persist?.().catch(() => {})
}

// ---------- 记录 ----------
/** 按事情发生的时间，新的在前 */
export const entries = computed(() => [...state.entries].sort((a, b) => b.happenedAt - a.happenedAt))

export function getEntry(id: string) {
  return state.entries.find((e) => e.id === id)
}

export function newEntry(): Entry {
  const now = Date.now()
  return {
    id: uid(),
    createdAt: now,
    updatedAt: now,
    happenedAt: now,
    situation: '',
    thought: '',
    emotions: [],
    before: null,
    reframe: '',
    after: null,
    cards: [],
    buddy: randomFigure(),
  }
}

/** 完成了认知重构（写了新看法，也打了第二次分） */
export function isDone(e: Entry) {
  return e.reframe.trim() !== '' && e.after !== null
}

export function isBlank(e: Entry) {
  return !e.situation.trim() && !e.thought.trim() && !e.reframe.trim() && e.emotions.length === 0 && e.before === null
}

export function saveEntry(e: Entry) {
  const copy: Entry = JSON.parse(JSON.stringify(e))
  copy.updatedAt = Date.now()
  const i = state.entries.findIndex((x) => x.id === copy.id)
  if (i >= 0) state.entries[i] = copy
  else state.entries.push(copy)
  persist()
  askPersistentStorage()
}

export function deleteEntry(id: string) {
  state.entries = state.entries.filter((e) => e.id !== id)
  persist()
}

// ---------- 草稿 ----------
export const draft = computed(() => state.draft)

export function saveDraft(entry: Entry, step: number) {
  state.draft = { entry: JSON.parse(JSON.stringify(entry)), step }
  localStorage.setItem(DRAFT_KEY, JSON.stringify(state.draft))
}

export function clearDraft() {
  state.draft = null
  localStorage.removeItem(DRAFT_KEY)
}

// ---------- 备份 ----------
export function backupJSON() {
  return JSON.stringify({ app: 'wo-jin-tian-you-nan-shou-le', version: 1, exportedAt: Date.now(), entries: state.entries }, null, 2)
}

/** 合并导入：同一条记录保留更新时间较新的那份。返回导入（新增或更新）的条数 */
export function restoreJSON(text: string) {
  const data = JSON.parse(text)
  const list: unknown[] = Array.isArray(data) ? data : data?.entries
  if (!Array.isArray(list)) throw new Error('不是有效的备份文件')
  let count = 0
  for (const raw of list) {
    const e = normalize(raw)
    if (!e) continue
    const i = state.entries.findIndex((x) => x.id === e.id)
    if (i < 0) {
      state.entries.push(e)
      count++
    } else if (e.updatedAt > state.entries[i].updatedAt) {
      state.entries[i] = e
      count++
    }
  }
  persist()
  return count
}

export function clearAll() {
  state.entries = []
  persist()
  clearDraft()
}
