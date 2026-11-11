<!-- 像用笔圈出来的圈圈，盖在被选中的情绪词上 -->
<script setup lang="ts">
import { computed } from 'vue'
import { handCirclePath } from '../utils'

const props = defineProps<{ seed: string; w: number; h: number; animate?: boolean }>()
// 圈圈比文字框四周各大出一点
const vw = computed(() => props.w + 10)
const vh = computed(() => props.h + 8)
const d = computed(() => handCirclePath(props.seed, vw.value, vh.value))
</script>

<template>
  <svg class="hc" :viewBox="`0 0 ${vw} ${vh}`" preserveAspectRatio="none" aria-hidden="true">
    <path :d="d" pathLength="1" :class="{ draw: animate }" />
  </svg>
</template>

<style scoped>
.hc {
  position: absolute;
  left: -5px;
  top: -4px;
  width: calc(100% + 10px);
  height: calc(100% + 8px);
  overflow: visible;
  pointer-events: none;
}
path {
  fill: none;
  stroke: var(--pen);
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.draw {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: draw 0.45s ease-out forwards;
}
@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}
</style>
