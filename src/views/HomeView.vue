<!-- 记录本首页 -->
<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import EntryCard from '../components/EntryCard.vue'
import Icon from '../components/Icon.vue'
import Mini from '../components/Mini.vue'
import { clearDraft, draft, entries, isDone, type Entry } from '../store'
import { confirmDialog } from '../ui'
import { dailyFigures, fmtDay, fmtMonth, todayLine } from '../utils'

const router = useRouter()
const now = Date.now()
const shelf = dailyFigures(5)

const pending = computed(() => entries.value.filter((e) => !isDone(e)))
const months = computed(() => {
  const out: { label: string; items: Entry[] }[] = []
  for (const e of entries.value.filter(isDone)) {
    const label = fmtMonth(e.happenedAt)
    if (out.at(-1)?.label !== label) out.push({ label, items: [] })
    out.at(-1)!.items.push(e)
  }
  return out
})

async function dropDraft() {
  const ok = await confirmDialog({
    title: '不要这页草稿了？',
    message: '没写完的内容会被删掉。',
    ok: '删掉草稿',
    cancel: '留着',
    danger: true,
    figure: 'pig',
  })
  if (ok) clearDraft()
}
</script>

<template>
  <div class="page home">
    <header class="hero">
      <p class="kicker">{{ fmtDay(now) }}</p>
      <h1 class="hand title">
        我今天又难受了
        <svg class="squiggle" viewBox="0 0 220 12" preserveAspectRatio="none" aria-hidden="true">
          <path d="M2 7c18-6 30 5 48 0s30-6 48 0 30 5 48 0 30-6 48 0 18 3 24 1" />
        </svg>
      </h1>
      <p class="line">{{ todayLine() }}</p>
    </header>

    <div class="shelf" aria-hidden="true">
      <div class="figs">
        <Mini v-for="(f, i) in shelf" :key="f" :name="f" :size="i % 2 ? 56 : 64" float :delay="i * 0.6" />
      </div>
      <div class="board patch" />
    </div>

    <section v-if="draft" class="cta patch" :style="{ '--bg': 'var(--g-butter)' }">
      <div class="cta-text">
        <h2 class="hand">上次那页还没写完</h2>
        <p>停在了第 {{ draft.step + 1 }} 步，要接着写吗？</p>
        <div class="cta-actions">
          <button class="btn small" :style="{ '--bg': 'var(--g-rose)' }" @click="router.push('/write')">
            接着写<Icon name="next" class="i" />
          </button>
          <button class="text-btn" @click="dropDraft">不要了</button>
        </div>
      </div>
      <Mini class="cta-fig" :name="draft.entry.buddy" :size="88" />
    </section>
    <section v-else class="cta patch" :style="{ '--bg': 'var(--g-rose)' }">
      <div class="cta-text">
        <h2 class="hand">又难受了？</h2>
        <p>别憋着，写一页认知重构记录，<br />陪自己把这件事想清楚。</p>
        <div class="cta-actions">
          <button class="btn small" :style="{ '--bg': 'linear-gradient(140deg,#fffaf6,#fbe9e4)' }" @click="router.push('/write')">
            <Icon name="edit" class="i" />写一页
          </button>
        </div>
      </div>
      <Mini class="cta-fig" name="rabbit" :size="92" />
    </section>

    <section v-if="pending.length" class="block">
      <div class="block-head">
        <Mini name="pig" :size="40" />
        <div>
          <h3>先存着的</h3>
          <p class="muted small">等有力气了，再回来换个角度看看。</p>
        </div>
      </div>
      <div class="list">
        <EntryCard v-for="e in pending" :key="e.id" :entry="e" />
      </div>
    </section>

    <section v-for="m in months" :key="m.label" class="block">
      <div class="month">
        <h3 class="hand">{{ m.label }}</h3>
        <span class="muted small">{{ m.items.length }} 页</span>
      </div>
      <div class="list">
        <EntryCard v-for="e in m.items" :key="e.id" :entry="e" />
      </div>
    </section>

    <section v-if="!entries.length" class="empty">
      <Mini name="sheep" :size="96" float />
      <p class="hand">记录本还是空的</p>
      <p class="muted small">下次难受的时候，就来这里写一写吧。<br />写下来，情绪就有了一个放的地方。</p>
    </section>
  </div>
</template>

<style scoped>
.hero {
  padding: 6px 4px 0;
}
.title {
  position: relative;
  display: inline-block;
  margin-top: 4px;
  font-size: 32px;
  font-weight: 400;
  line-height: 1.3;
  color: #4a3c41;
}
.squiggle {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -6px;
  width: 100%;
  height: 10px;
  fill: none;
  stroke: #f0b3ba;
  stroke-width: 3;
  stroke-linecap: round;
}
.line {
  margin-top: 12px;
  font-size: 14px;
  color: var(--ink-2);
}

.shelf {
  position: relative;
  margin: 14px 0 22px;
}
.figs {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  padding: 0 8px;
  margin-bottom: -12px;
}
.board {
  --radius: 12px;
  --bg: var(--g-sand);
  height: 22px;
}
.board::after {
  inset: 4px;
  border-radius: 8px;
}

.cta {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  padding: 22px 16px 20px 22px;
}
.cta-text {
  flex: 1;
  min-width: 0;
}
.cta h2 {
  font-size: 24px;
  font-weight: 400;
  color: #5a3f46;
}
.cta p {
  margin-top: 6px;
  font-size: 13.5px;
  line-height: 1.7;
  color: rgb(90 63 70 / 0.8);
}
.cta-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
}
.i {
  width: 17px;
  height: 17px;
}
.cta-fig {
  flex: none;
  margin-right: 2px;
}

.block {
  margin-top: 30px;
}
.block-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.block-head h3 {
  font-size: 16px;
}
.month {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin: 0 4px 12px;
}
.month h3 {
  font-size: 20px;
  font-weight: 400;
}
.small {
  font-size: 12.5px;
}
.list {
  display: grid;
  gap: 14px;
}
.empty {
  display: grid;
  justify-items: center;
  gap: 8px;
  margin-top: 40px;
  text-align: center;
}
.empty .hand {
  margin-top: 6px;
  font-size: 20px;
}
.empty .small {
  line-height: 1.8;
}
</style>
