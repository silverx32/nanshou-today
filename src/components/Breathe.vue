<!-- 跟着小猫呼吸：吸气 4 秒，停 2 秒，呼气 6 秒 -->
<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import Mini from './Mini.vue'

const CYCLE = 12000
const running = ref(false)
const elapsed = ref(0)
let start = 0
let raf = 0

function tick(now: number) {
  elapsed.value = (now - start) % CYCLE
  raf = requestAnimationFrame(tick)
}
function toggle() {
  running.value = !running.value
  cancelAnimationFrame(raf)
  if (running.value) {
    start = performance.now()
    raf = requestAnimationFrame(tick)
  } else {
    elapsed.value = 0
  }
}
onUnmounted(() => cancelAnimationFrame(raf))

const phase = computed(() => {
  const t = elapsed.value / 1000
  if (!running.value) return { text: '准备好了就开始', left: 0, scale: 0.72 }
  if (t < 4) return { text: '慢慢吸气', left: Math.ceil(4 - t), scale: 0.72 + 0.28 * (t / 4) }
  if (t < 6) return { text: '停一下', left: Math.ceil(6 - t), scale: 1 }
  return { text: '慢慢呼气', left: Math.ceil(12 - t), scale: 1 - 0.28 * ((t - 6) / 6) }
})
</script>

<template>
  <div class="breathe">
    <div class="ring" :style="{ transform: `scale(${phase.scale})` }">
      <Mini name="cat" :size="78" />
    </div>
    <p class="phase hand">
      {{ phase.text }}<span v-if="running"> · {{ phase.left }}</span>
    </p>
    <button class="btn small" :style="{ '--bg': 'var(--g-sage)' }" @click="toggle">{{ running ? '停下来' : '跟着呼吸' }}</button>
  </div>
</template>

<style scoped>
.breathe {
  display: grid;
  justify-items: center;
  gap: 12px;
  padding: 8px 0 4px;
}
.ring {
  width: 168px;
  height: 168px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--grain), radial-gradient(circle at 40% 35%, #f6fbf3, #cfe3c9);
  box-shadow: var(--shadow-felt), 0 0 0 10px rgb(207 227 201 / 0.35);
  will-change: transform;
}
.phase {
  font-size: 20px;
  color: var(--ink);
}
</style>
