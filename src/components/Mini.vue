<!-- 一个微缩小人 -->
<script setup lang="ts">
import { computed } from 'vue'
import { FIGURES, figureUrl } from '../data/figures'

const props = withDefaults(defineProps<{ name: string; size?: number; float?: boolean; delay?: number }>(), {
  size: 80,
  float: false,
  delay: 0,
})
const alt = computed(() => FIGURES[props.name as keyof typeof FIGURES] ?? '')
</script>

<template>
  <img
    class="mini"
    :class="{ float }"
    :src="figureUrl(name)"
    :alt="alt"
    :style="{ height: `${size}px`, animationDelay: `${delay}s` }"
    draggable="false"
  />
</template>

<style scoped>
.mini {
  display: block;
  width: auto;
  filter: drop-shadow(0 5px 6px rgb(120 86 76 / 0.16));
}
.float {
  animation: bob 3.4s ease-in-out infinite;
}
</style>
