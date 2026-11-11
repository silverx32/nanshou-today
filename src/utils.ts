import { FIGURE_IDS, type FigureId } from './data/figures'

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

// ---------- 日期 ----------
const WEEK = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
const pad = (n: number) => String(n).padStart(2, '0')

/** 11月10日 周一 */
export function fmtDay(ts: number) {
  const d = new Date(ts)
  return `${d.getMonth() + 1}月${d.getDate()}日 ${WEEK[d.getDay()]}`
}
/** 14:32 */
export function fmtTime(ts: number) {
  const d = new Date(ts)
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}
/** 2026.11.10 */
export function fmtDate(ts: number) {
  const d = new Date(ts)
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`
}
/** 2026年11月 */
export function fmtMonth(ts: number) {
  const d = new Date(ts)
  return `${d.getFullYear()}年${d.getMonth() + 1}月`
}
/** datetime-local 输入框用的格式 */
export function toInputValue(ts: number) {
  const d = new Date(ts)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}
export function fromInputValue(v: string) {
  const t = new Date(v).getTime()
  return Number.isFinite(t) ? t : Date.now()
}
/** 本地时间的「第几天」，用来做每日轮换 */
export function localDayIndex(now = new Date()) {
  return Math.floor((now.getTime() - now.getTimezoneOffset() * 60000) / 86400000)
}

// ---------- 可复现的随机数 ----------
export function hashStr(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}
export function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** 每天换一批站在架子上的小人 */
export function dailyFigures(count: number, now = new Date()): FigureId[] {
  const rnd = seeded(localDayIndex(now) * 7919)
  const pool = [...FIGURE_IDS]
  const out: FigureId[] = []
  while (out.length < count && pool.length) out.push(pool.splice(Math.floor(rnd() * pool.length), 1)[0])
  return out
}

// ---------- 手绘圈圈 ----------
/**
 * 生成一个像用笔圈出来的椭圆：半径有轻微起伏，首尾错开交叠。
 * 同一个 seed 永远得到同一个形状，所以同一个词每次圈得都一样。
 */
export function handCirclePath(seed: string, w: number, h: number) {
  const rnd = seeded(hashStr(seed))
  const cx = w / 2
  const cy = h / 2
  const rx = w / 2 - 2
  const ry = h / 2 - 2
  const start = -Math.PI * (0.55 + rnd() * 0.3)
  const sweep = Math.PI * 2 * (1.07 + rnd() * 0.09)
  const n = 16
  const pts: [number, number][] = []
  for (let i = 0; i <= n; i++) {
    const t = start + (sweep * i) / n
    const k = 1 + (rnd() - 0.5) * 0.07 - (i / n) * 0.06
    pts.push([cx + Math.cos(t) * rx * k, cy + Math.sin(t) * ry * k])
  }
  // Catmull-Rom 转三次贝塞尔，让线条顺滑
  const f = (n: number) => n.toFixed(1)
  let d = `M${f(pts[0][0])},${f(pts[0][1])}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? p2
    d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)},${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)},${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])},${f(p2[1])}`
  }
  return d
}

// ---------- 分数 ----------
export function scoreBg(n: number | null) {
  if (n === null) return 'var(--g-cream)'
  if (n <= 3) return 'var(--g-sage)'
  if (n <= 6) return 'var(--g-butter)'
  return 'var(--g-rose)'
}

/** 第二次打分后的一句话 */
export function changeMessage(before: number | null, after: number | null) {
  if (before === null || after === null) return ''
  const diff = before - after
  if (diff >= 3) return `降了 ${diff} 分。换个角度看，心里松了好多。`
  if (diff > 0) return `降了 ${diff} 分。哪怕只松动一点点，也很了不起。`
  if (diff === 0) return '分数没变也没关系。愿意停下来写一写，本身就是在照顾自己。'
  return '写下来之后更难受了一点，这也很正常。要不要先休息一下，或者找信任的人聊聊？'
}

// ---------- 温柔的话 ----------
const LINES = [
  '难受的时候，先把它写下来吧。',
  '情绪没有对错，它只是来提醒你一些事。',
  '你不需要马上好起来。',
  '想法只是想法，不一定是事实。',
  '今天也辛苦了，慢慢来。',
  '允许自己有不开心的时候。',
  '写下来，就是在好好照顾自己。',
]
export function todayLine(now = new Date()) {
  return LINES[localDayIndex(now) % LINES.length]
}

// ---------- 需要更多帮助的信号 ----------
const CRISIS = /想死|不想活|活不下去|活着没意思|自杀|轻生|结束生命|结束自己|了结自己|伤害自己|自残|自伤|割腕|跳楼|想消失/
export function hasCrisisSignal(...texts: string[]) {
  return texts.some((t) => CRISIS.test(t))
}
