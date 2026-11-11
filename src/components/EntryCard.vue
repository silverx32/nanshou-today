<!-- 记录本列表里的一页 -->
<script setup lang="ts">
import { computed } from 'vue'
import { groupOf } from '../data/emotions'
import { isDone, type Entry } from '../store'
import { fmtDay, fmtTime, scoreBg } from '../utils'
import Mini from './Mini.vue'

const props = defineProps<{ entry: Entry }>()

const done = computed(() => isDone(props.entry))
const bg = computed(() => (props.entry.emotions.length ? groupOf(props.entry.emotions[0])?.bg : undefined) ?? 'var(--g-sand)')
const text = computed(() => props.entry.situation.trim() || props.entry.thought.trim() || '（还没写发生了什么）')
</script>

<template>
  <RouterLink :to="`/entry/${entry.id}`" class="entry patch" :style="{ '--bg': bg }">
    <div class="top">
      <span class="date">{{ fmtDay(entry.happenedAt) }} · {{ fmtTime(entry.happenedAt) }}</span>
      <span v-if="!done" class="tag">待整理</span>
    </div>
    <p class="text hand">{{ text }}</p>
    <div class="emos">
      <span v-for="w in entry.emotions.slice(0, 3)" :key="w" class="emo">{{ w }}</span>
      <span v-if="entry.emotions.length > 3" class="more">+{{ entry.emotions.length - 3 }}</span>
    </div>
    <div class="side">
      <Mini :name="entry.buddy" :size="56" />
      <span v-if="entry.before !== null" class="change">
        <b :style="{ '--bg': scoreBg(entry.before) }">{{ entry.before }}</b>
        <svg viewBox="0 0 20 10" aria-hidden="true"><path d="M1 5h17M14 1.5L18 5l-4 3.5" /></svg>
        <b :style="{ '--bg': scoreBg(entry.after) }">{{ entry.after ?? '?' }}</b>
      </span>
    </div>
  </RouterLink>
</template>

<style scoped>
.entry {
  display: block;
  min-height: 128px;
  padding: 16px 96px 16px 18px;
  color: inherit;
  text-decoration: none;
  transition: transform 0.15s;
}
.entry:active {
  transform: scale(0.985);
}
.top {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: rgb(90 71 76 / 0.6);
}
.tag {
  padding: 0 8px;
  border-radius: 999px;
  font-size: 11px;
  line-height: 20px;
  color: #a5646d;
  background: rgb(255 255 255 / 0.7);
}
.text {
  margin: 6px 0 10px;
  font-size: 17px;
  line-height: 1.55;
  color: #47393e;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.emos {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.emo,
.more {
  padding: 0 9px;
  border-radius: 999px;
  font-size: 12px;
  line-height: 22px;
  color: var(--ink-2);
  background: rgb(255 255 255 / 0.6);
}
.side {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 12px;
  width: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.change {
  display: inline-flex;
  align-items: center;
  gap: 2px;
}
.change b {
  width: 25px;
  height: 25px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  font-family: var(--font-hand);
  font-size: 15px;
  font-weight: 400;
  background: var(--grain), var(--bg);
  box-shadow: inset 0 0 0 1.5px rgb(255 255 255 / 0.8);
}
.change svg {
  width: 14px;
  fill: none;
  stroke: rgb(90 71 76 / 0.45);
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
