<!-- 一页认知重构记录，排版照着纸质记录本来 -->
<script setup lang="ts">
import { computed } from 'vue'
import { cardNo, getCard, type RestartCard } from '../data/cards'
import type { Entry } from '../store'
import { fmtDate, fmtDay, fmtTime, scoreBg } from '../utils'
import EmotionGrid from './EmotionGrid.vue'
import Mini from './Mini.vue'

const props = defineProps<{ entry: Entry }>()

const cards = computed(() => props.entry.cards.map(getCard).filter((c): c is RestartCard => !!c))
const weekday = computed(() => fmtDay(props.entry.happenedAt).split(' ')[1])
</script>

<template>
  <article class="paper">
    <span class="ribbon" aria-hidden="true" />
    <Mini class="buddy" :name="entry.buddy" :size="66" />

    <section>
      <div class="head-row">
        <span class="tiny">时间 | 地点<br />人物 | 事件</span>
        <i class="bar" />
        <h4>发生了什么事？</h4>
      </div>
      <p class="when hand">{{ fmtDate(entry.happenedAt) }} {{ weekday }} {{ fmtTime(entry.happenedAt) }}</p>
      <p class="ink hand">{{ entry.situation || '　' }}</p>
    </section>

    <section>
      <small class="pre">是什么想法引起了</small>
      <h4 class="big">你的情绪？</h4>
      <p class="ink hand">{{ entry.thought || '　' }}</p>
    </section>

    <section>
      <h4>当时的感受是什么？</h4>
      <div class="feel">
        <EmotionGrid class="grid" :model-value="entry.emotions" />
        <div class="scores">
          <p class="note">圈出你的情绪，按照强度给情绪打分，满分10分</p>
          <div class="sbox" :style="{ '--bg': scoreBg(entry.before) }">
            <span class="hand">{{ entry.before ?? '' }}</span><small>0-10分</small>
          </div>
          <p class="note">第二次打分 →</p>
          <div class="sbox" :style="{ '--bg': scoreBg(entry.after) }">
            <span class="hand">{{ entry.after ?? '' }}</span><small>0-10分</small>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="reframe-head">
        <div>
          <h4>还可以怎么看待这件事？</h4>
          <small class="sub">使用情绪重启卡，帮自己找到积极想法~</small>
        </div>
        <div class="calm">
          <svg viewBox="0 0 20 30" aria-hidden="true"><path d="M10 29C9 20 11 10 10 2M5 7l5-5 5 5" /></svg>
          <span>情绪有平复吗？<br />来给它打个分吧</span>
        </div>
      </div>
      <p class="ink hand dashed">{{ entry.reframe || '　' }}</p>
      <div v-if="cards.length" class="used">
        <span v-for="c in cards" :key="c.id" class="used-card" :style="{ '--bg': c.bg }">
          <Mini :name="c.figure" :size="24" />{{ cardNo(c) }} {{ c.title }}
        </span>
      </div>
    </section>

    <footer>如果毫无头绪，试着问自己：三年后还会在意这件事吗？</footer>
  </article>
</template>

<style scoped>
.paper {
  position: relative;
  padding: 22px 18px 16px;
  border-radius: 20px;
  background: var(--grain), linear-gradient(180deg, #fffdf9, #fbf6ef);
  box-shadow: 0 1px 0 #fff inset, 0 14px 30px -16px rgb(120 86 76 / 0.45), 0 2px 6px rgb(120 86 76 / 0.08);
  color: #6f6266;
}
.ribbon {
  position: absolute;
  top: -4px;
  left: 26px;
  width: 14px;
  height: 46px;
  background: var(--grain), linear-gradient(180deg, #f3c0c7, #e9a4ad);
  clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%);
}
.buddy {
  position: absolute;
  top: -26px;
  right: 14px;
}
section {
  padding: 12px 0 14px;
  border-bottom: 1.5px solid #e6d8cd;
}
h4 {
  font-size: 18px;
  font-weight: 500;
  color: #5d5054;
  letter-spacing: 0.04em;
}
.head-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-right: 64px;
}
.tiny {
  font-size: 10px;
  line-height: 1.35;
  color: var(--ink-3);
  white-space: nowrap;
}
.bar {
  width: 1.5px;
  height: 24px;
  background: #d9c9bd;
}
.when {
  margin-top: 8px;
  font-size: 14px;
  color: var(--ink-3);
}
.pre {
  display: block;
  font-size: 12px;
  color: var(--ink-3);
}
.big {
  font-size: 22px;
}
.ink {
  margin-top: 4px;
  min-height: 64px;
  font-size: 18px;
  line-height: 32px;
  color: #3f3438;
  white-space: pre-wrap;
  word-break: break-word;
  background: linear-gradient(to bottom, transparent 31px, var(--line) 31px) 0 0 / 100% 32px;
}
.ink.dashed {
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='32'%3E%3Crect y='31' width='4.5' height='1' fill='%23dfcdc1'/%3E%3C/svg%3E")
    0 0 / 8px 32px;
}

.feel {
  display: flex;
  gap: 12px;
  margin-top: 10px;
}
.grid {
  flex: 1;
  min-width: 0;
}
.scores {
  flex: none;
  width: 86px;
  display: grid;
  justify-items: center;
  align-content: start;
  gap: 6px;
  padding-left: 12px;
  border-left: 1.5px solid #ece1d8;
}
.note {
  font-size: 10.5px;
  line-height: 1.45;
  color: var(--ink-3);
  text-align: center;
}
.sbox {
  position: relative;
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  align-content: center;
  border-radius: 14px;
  background: var(--grain), var(--bg);
  box-shadow: inset 0 0 0 1.5px rgb(120 90 80 / 0.25);
}
.sbox span {
  font-size: 30px;
  line-height: 1;
  color: #3f3438;
  min-height: 30px;
}
.sbox small {
  font-size: 9px;
  color: var(--ink-3);
}

.reframe-head {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}
.sub {
  display: block;
  margin-top: 2px;
  font-size: 11.5px;
  font-style: italic;
  color: var(--ink-3);
}
.calm {
  flex: none;
  width: 86px;
  display: grid;
  justify-items: center;
  font-size: 10.5px;
  line-height: 1.45;
  text-align: center;
  color: var(--ink-3);
  margin-top: -12px;
}
.calm svg {
  width: 14px;
  height: 22px;
  fill: none;
  stroke: #c9b2a5;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.used {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}
.used-card {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px 3px 6px;
  border-radius: 999px;
  font-size: 12px;
  color: var(--ink-2);
  background: var(--grain), var(--bg);
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.7);
}
footer {
  padding-top: 12px;
  font-size: 11.5px;
  color: var(--ink-3);
  text-align: center;
}
</style>
