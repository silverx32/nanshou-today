<!-- 0~10 分的情绪强度打分：点或拖都可以 -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import { scoreBg } from '../utils'

const props = defineProps<{ modelValue: number | null; label?: string }>()
const emit = defineEmits<{ 'update:modelValue': [number] }>()

const track = ref<HTMLElement>()
let dragging = false

function setFromX(x: number) {
  const r = track.value!.getBoundingClientRect()
  const v = Math.round(((x - r.left) / r.width) * 10)
  const clamped = Math.max(0, Math.min(10, v))
  if (clamped !== props.modelValue) {
    emit('update:modelValue', clamped)
    navigator.vibrate?.(6)
  }
}
function down(e: PointerEvent) {
  dragging = true
  track.value!.setPointerCapture(e.pointerId)
  setFromX(e.clientX)
}
function move(e: PointerEvent) {
  if (dragging) setFromX(e.clientX)
}
function up() {
  dragging = false
}
function key(e: KeyboardEvent) {
  const v = props.modelValue ?? 5
  const next = { ArrowRight: v + 1, ArrowUp: v + 1, ArrowLeft: v - 1, ArrowDown: v - 1, Home: 0, End: 10 }[e.key]
  if (next === undefined) return
  e.preventDefault()
  emit('update:modelValue', Math.max(0, Math.min(10, next)))
}

const pct = computed(() => ((props.modelValue ?? 5) / 10) * 100)
</script>

<template>
  <div class="score">
    <div class="box patch light" :style="{ '--bg': scoreBg(modelValue) }">
      <span class="num hand">{{ modelValue ?? '?' }}</span>
      <small>0-10分</small>
    </div>
    <div class="slider">
      <div
        ref="track"
        class="track"
        role="slider"
        tabindex="0"
        aria-valuemin="0"
        aria-valuemax="10"
        :aria-valuenow="modelValue ?? undefined"
        :aria-label="label ?? '情绪强度'"
        @pointerdown="down"
        @pointermove="move"
        @pointerup="up"
        @pointercancel="up"
        @keydown="key"
      >
        <span class="rail"><i v-for="n in 11" :key="n" /></span>
        <span class="thumb" :class="{ unset: modelValue === null }" :style="{ left: `${pct}%` }" />
      </div>
      <div class="labels">
        <span>0 平静</span>
        <span>5 有点难受</span>
        <span>10 非常强烈</span>
      </div>
      <p v-if="modelValue === null" class="hint">点一下或拖一拖来打分</p>
    </div>
  </div>
</template>

<style scoped>
.score {
  display: flex;
  align-items: center;
  gap: 16px;
}
.box {
  --radius: 18px;
  flex: none;
  width: 78px;
  height: 78px;
  display: grid;
  place-items: center;
  align-content: center;
  transition: background 0.3s;
}
.num {
  font-size: 40px;
  line-height: 1;
  color: var(--ink);
}
.box small {
  font-size: 10px;
  color: var(--ink-3);
  margin-top: 2px;
}
.slider {
  flex: 1;
  min-width: 0;
}
.track {
  position: relative;
  height: 40px;
  margin: 0 12px;
  touch-action: pan-y;
  cursor: pointer;
  outline: none;
}
.rail {
  position: absolute;
  left: -6px;
  right: -6px;
  top: 13px;
  height: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 6px;
  border-radius: 999px;
  background: var(--grain), linear-gradient(90deg, #cfe2c8, #f5e2aa 50%, #f2bcc3);
  box-shadow: inset 0 1px 2px rgb(120 86 76 / 0.18);
}
.rail i {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgb(255 255 255 / 0.85);
}
.thumb {
  position: absolute;
  top: 3px;
  width: 34px;
  height: 34px;
  margin-left: -17px;
  border-radius: 50%;
  background: var(--grain), radial-gradient(circle at 35% 30%, #fff, #f3e7de);
  box-shadow: var(--shadow-felt);
  transition: left 0.12s ease-out, opacity 0.2s;
}
.thumb::after {
  content: '';
  position: absolute;
  inset: 4px;
  border-radius: 50%;
  border: 1.3px dashed rgb(176 146 134 / 0.45);
}
.thumb.unset {
  opacity: 0;
}
.track:focus-visible .thumb {
  outline: 2px solid var(--pen);
  outline-offset: 2px;
}
.labels {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--ink-3);
  margin-top: 2px;
}
.hint {
  font-size: 12px;
  color: var(--pen);
  margin-top: 4px;
  text-align: center;
}
</style>
