<!-- 写一页：五步，结构和纸质记录本一样 -->
<script setup lang="ts">
import { computed, onUnmounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BottomSheet from '../components/BottomSheet.vue'
import CardDraw from '../components/CardDraw.vue'
import EmotionGrid from '../components/EmotionGrid.vue'
import Icon from '../components/Icon.vue'
import LinedTextarea from '../components/LinedTextarea.vue'
import Mini from '../components/Mini.vue'
import ScorePicker from '../components/ScorePicker.vue'
import { cardNo, getCard, type RestartCard } from '../data/cards'
import { clearDraft, draft, getEntry, isBlank, isDone, newEntry, saveDraft, saveEntry, type Entry } from '../store'
import { confirmDialog, onBack, toast } from '../ui'
import { changeMessage, fromInputValue, scoreBg, toInputValue } from '../utils'

const STEPS = [
  {
    title: '发生了什么事？',
    kicker: '时间 | 地点 | 人物 | 事件',
    fig: 'raccoon',
    hint: '像旁观者一样，客观地写下发生了什么。',
    placeholder: '比如：今天开会时，我说完一个想法，同事回了一句“这个是不是还要再想想？”',
  },
  {
    title: '是什么想法引起了你的情绪？',
    kicker: '那一刻冒出来的念头',
    fig: 'fox',
    hint: '脑子里闪过的话，原原本本写下来就好，不用修饰，也不用讲道理。',
    placeholder: '比如：他是不是觉得我说得特别蠢？其他人会不会也这么觉得？我当时是不是就不该说话？',
  },
  { title: '当时的感受是什么？', kicker: '圈出你的情绪', fig: 'hedgehog', hint: '可以圈好几个，没有合适的词就自己加一个。' },
  {
    title: '还可以怎么看待这件事？',
    kicker: '使用情绪重启卡，帮自己找到积极想法~',
    fig: 'pony',
    hint: '如果毫无头绪，试着问自己：三年后还会在意这件事吗？',
    placeholder: '比如：他说的是“这个想法可以再想想”，不是“你很蠢”。开会本来就是拿想法出来讨论的。',
  },
  { title: '情绪有平复吗？', kicker: '来给它打个分吧', fig: 'goose', hint: '' },
]

const route = useRoute()
const router = useRouter()

const existing = typeof route.params.id === 'string' ? getEntry(route.params.id) : undefined
const isEdit = !!existing
const wasDone = existing ? isDone(existing) : false

const entry = reactive<Entry>(JSON.parse(JSON.stringify(existing ?? draft.value?.entry ?? newEntry())))
const step = ref(Math.min(4, Math.max(0, Number(isEdit ? route.query.step ?? 0 : draft.value?.step ?? 0) || 0)))
const snapshot = JSON.stringify(entry)

// 从「重启卡」页带着一张卡进来
const fromCard = typeof route.query.card === 'string' ? route.query.card : ''
if (fromCard && getCard(fromCard) && !entry.cards.includes(fromCard)) entry.cards.push(fromCard)

// 新写的一页随时存草稿，关掉 App 也不会丢
if (!isEdit) {
  watch(
    [entry, step],
    () => (isBlank(entry) && !entry.cards.length ? clearDraft() : saveDraft(entry, step.value)),
    { deep: true, immediate: !!fromCard },
  )
}

const cur = computed(() => STEPS[step.value])
const dir = ref('next')
watch(step, (n, o) => (dir.value = n > o ? 'next' : 'prev'))

function go(i: number) {
  step.value = i
  window.scrollTo({ top: 0 })
}

// ---------- 重启卡 ----------
const drawing = ref(false)
const usedCards = computed(() => entry.cards.map(getCard).filter((c): c is RestartCard => !!c))
function useCard(id: string) {
  if (!entry.cards.includes(id)) entry.cards.push(id)
  drawing.value = false
}
function removeCard(id: string) {
  entry.cards = entry.cards.filter((x) => x !== id)
}

// ---------- 保存 ----------
const msg = computed(() => changeMessage(entry.before, entry.after))

function persist() {
  saveEntry(entry)
  if (!isEdit) clearDraft()
}

function leave() {
  if (window.history.state?.back) router.back()
  else router.replace('/')
}

function finish() {
  if (isBlank(entry)) return toast('还什么都没写呢')
  persist()
  if (isEdit && (wasDone || !isDone(entry))) {
    toast('改好了')
    return leave()
  }
  router.replace(`/done/${entry.id}`)
}

function saveForLater() {
  if (isBlank(entry)) return toast('还什么都没写呢')
  persist()
  toast('先存好了，等你有力气了再来整理')
  if (isEdit) leave()
  else router.replace('/')
}

// 安卓返回键和左上角的 × 走同一套逻辑
onUnmounted(onBack(() => close()))

async function close() {
  if (isEdit) {
    const changed = JSON.stringify(entry) !== snapshot
    if (changed && !(await confirmDialog({ title: '放弃这次修改？', message: '刚才改的内容不会保存。', ok: '放弃修改', cancel: '继续改', danger: true }))) return
  } else if (!isBlank(entry)) {
    toast('草稿存好了，下次可以接着写')
  }
  leave()
}
</script>

<template>
  <div class="page full editor">
    <div class="topbar">
      <button class="icon-btn" aria-label="关闭" @click="close"><Icon name="close" /></button>
      <div class="progress">
        <button
          v-for="(s, i) in STEPS"
          :key="i"
          class="dot"
          :class="{ on: i === step, past: i < step }"
          :aria-label="`第 ${i + 1} 步：${s.title}`"
          @click="go(i)"
        />
      </div>
      <span class="count">{{ step + 1 }} / 5</span>
    </div>

    <Transition :name="dir" mode="out-in">
      <section :key="step" class="step">
        <div class="step-head">
          <div class="step-title">
            <p class="kicker">{{ cur.kicker }}</p>
            <h2 class="hand">{{ cur.title }}</h2>
          </div>
          <Mini :name="cur.fig" :size="78" float />
        </div>

        <!-- 1 发生了什么事 -->
        <template v-if="step === 0">
          <label class="when">
            <Icon name="clock" class="i" />
            <span>发生在</span>
            <input
              type="datetime-local"
              :value="toInputValue(entry.happenedAt)"
              @change="entry.happenedAt = fromInputValue(($event.target as HTMLInputElement).value)"
            />
          </label>
          <div class="sheet patch light">
            <LinedTextarea v-model="entry.situation" :rows="5" :placeholder="cur.placeholder" />
          </div>
          <p class="hint">{{ cur.hint }}</p>
        </template>

        <!-- 2 想法 -->
        <template v-else-if="step === 1">
          <blockquote v-if="entry.situation.trim()" class="quote">
            <span class="kicker">发生的事</span>
            <p class="hand">{{ entry.situation }}</p>
          </blockquote>
          <div class="sheet patch light">
            <LinedTextarea v-model="entry.thought" :rows="5" :placeholder="cur.placeholder" />
          </div>
          <p class="hint">{{ cur.hint }}</p>
        </template>

        <!-- 3 感受 + 第一次打分 -->
        <template v-else-if="step === 2">
          <div class="sheet patch light">
            <EmotionGrid v-model="entry.emotions" editable />
          </div>
          <p class="hint">{{ cur.hint }}</p>
          <h3 class="sub hand">按照强度给情绪打分，满分 10 分</h3>
          <div class="sheet patch light">
            <ScorePicker v-model="entry.before" label="第一次打分" />
          </div>
        </template>

        <!-- 4 换个角度 -->
        <template v-else-if="step === 3">
          <blockquote v-if="entry.thought.trim()" class="quote">
            <span class="kicker">你当时的想法</span>
            <p class="hand">{{ entry.thought }}</p>
          </blockquote>
          <div v-for="c in usedCards" :key="c.id" class="used patch" :style="{ '--bg': c.bg }">
            <Mini :name="c.figure" :size="58" />
            <div class="used-text">
              <p class="kicker">{{ cardNo(c) }} · {{ c.title }}</p>
              <p class="hand">{{ c.question }}</p>
            </div>
            <button class="x" :aria-label="`移除 ${c.title}`" @click="removeCard(c.id)"><Icon name="close" /></button>
          </div>
          <button class="btn block draw-btn" :style="{ '--bg': 'var(--g-lilac)' }" @click="drawing = true">
            <Icon name="cards" class="i" />{{ usedCards.length ? '再抽一张情绪重启卡' : '抽一张情绪重启卡' }}
          </button>
          <div class="sheet patch light">
            <LinedTextarea v-model="entry.reframe" :rows="5" dashed :placeholder="cur.placeholder" />
          </div>
          <p class="hint">{{ cur.hint }}</p>
        </template>

        <!-- 5 第二次打分 -->
        <template v-else>
          <div class="sheet patch light">
            <div class="first">
              <span class="kicker">第一次打分</span>
              <b class="hand" :style="{ '--bg': scoreBg(entry.before) }">{{ entry.before ?? '–' }}</b>
              <span class="kicker">第二次打分 ↓</span>
            </div>
            <ScorePicker v-model="entry.after" label="第二次打分" />
          </div>
          <p v-if="msg" class="msg hand">{{ msg }}</p>
        </template>
      </section>
    </Transition>

    <div class="nav">
      <button v-if="step > 0" class="btn soft" @click="go(step - 1)">上一步</button>
      <button v-if="step < 4" class="btn" @click="go(step + 1)">下一步</button>
      <button v-else class="btn" :style="{ '--bg': 'var(--g-sage)' }" @click="finish">
        {{ isEdit ? '保存修改' : '收进记录本' }}
      </button>
    </div>
    <div v-if="step === 2 || step === 3" class="later">
      <button class="text-btn" @click="saveForLater">先存着，晚点再整理</button>
    </div>

    <BottomSheet :open="drawing" title="抽一张情绪重启卡" @close="drawing = false">
      <CardDraw v-if="drawing" :exclude="entry.cards" @use="useCard" />
    </BottomSheet>
  </div>
</template>

<style scoped>
.topbar {
  gap: 14px;
}
.progress {
  flex: 1;
  display: flex;
  justify-content: center;
  gap: 8px;
}
.dot {
  width: 26px;
  height: 8px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: rgb(176 146 134 / 0.22);
  transition: background 0.3s, width 0.3s;
}
.dot.past {
  background: #f0c3c9;
}
.dot.on {
  width: 40px;
  background: var(--grain), linear-gradient(90deg, #f3b8c0, #e99aa5);
}
.count {
  width: 42px;
  text-align: right;
  font-size: 13px;
  color: var(--ink-3);
}

.step-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10px;
  margin: 4px 0 16px;
}
.step-title {
  min-width: 0;
  padding-bottom: 6px;
}
.step-title h2 {
  margin-top: 4px;
  font-size: 26px;
  font-weight: 400;
  line-height: 1.35;
  color: #4a3c41;
}
.sheet {
  padding: 18px 18px 16px;
}
.sheet + .sheet,
.sub + .sheet {
  margin-top: 12px;
}
.hint {
  margin: 10px 6px 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--ink-3);
}
.sub {
  margin: 24px 4px 0;
  font-size: 18px;
  font-weight: 400;
}

.when {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  padding: 4px 6px 4px 14px;
  border-radius: 999px;
  font-size: 13px;
  color: var(--ink-2);
  background: rgb(255 255 255 / 0.6);
  box-shadow: inset 0 0 0 1px rgb(176 146 134 / 0.2);
}
.when .i {
  width: 16px;
  height: 16px;
}
.when input {
  border: 0;
  outline: none;
  background: transparent;
  font: inherit;
  font-family: var(--font-hand);
  font-size: 15px;
  color: var(--ink);
  min-width: 0;
}

.quote {
  margin: 0 0 14px;
  padding: 12px 16px;
  border-left: 3px solid #efc2c8;
  border-radius: 4px 14px 14px 4px;
  background: rgb(255 255 255 / 0.45);
}
.quote p {
  margin-top: 2px;
  font-size: 16px;
  line-height: 1.6;
  color: var(--ink-2);
  white-space: pre-wrap;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.used {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 12px 12px 14px;
  margin-bottom: 12px;
}
.used-text {
  flex: 1;
  min-width: 0;
}
.used-text .kicker {
  color: rgb(90 71 76 / 0.6);
}
.used-text .hand {
  margin-top: 2px;
  font-size: 16px;
  line-height: 1.5;
  color: #4f3f44;
}
.x {
  position: relative;
  z-index: 1;
  flex: none;
  align-self: flex-start;
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: rgb(255 255 255 / 0.6);
  color: var(--ink-2);
}
.x svg {
  width: 15px;
  height: 15px;
}
.draw-btn {
  margin-bottom: 14px;
}
.i {
  width: 19px;
  height: 19px;
}

.first {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}
.first b {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  font-size: 24px;
  font-weight: 400;
  background: var(--grain), var(--bg);
  box-shadow: inset 0 0 0 1.5px rgb(255 255 255 / 0.8);
}
.first .kicker:last-child {
  margin-left: auto;
}
.msg {
  margin: 18px 8px 0;
  font-size: 18px;
  line-height: 1.7;
  color: #6b5a5f;
  text-align: center;
}

.nav {
  display: flex;
  gap: 12px;
  margin-top: 28px;
}
.nav .btn {
  flex: 1;
}
.nav .btn.soft {
  flex: 0.7;
}
.later {
  text-align: center;
  margin-top: 10px;
}

/* 步骤切换的滑动 */
.next-enter-active,
.next-leave-active,
.prev-enter-active,
.prev-leave-active {
  transition: opacity 0.2s ease, transform 0.22s ease;
}
.next-enter-from,
.prev-leave-to {
  opacity: 0;
  transform: translateX(24px);
}
.next-leave-to,
.prev-enter-from {
  opacity: 0;
  transform: translateX(-24px);
}
</style>
