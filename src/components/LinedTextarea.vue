<!-- 带横线的书写区，用手写字体，随内容自动变高 -->
<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{ modelValue: string; placeholder?: string; dashed?: boolean; rows?: number }>(), {
  placeholder: '',
  dashed: false,
  rows: 3,
})
const emit = defineEmits<{ 'update:modelValue': [string] }>()
const el = ref<HTMLTextAreaElement>()

function fit() {
  const t = el.value
  if (!t) return
  t.style.height = 'auto'
  t.style.height = `${Math.max(t.scrollHeight, props.rows * 34)}px`
}

watch(() => props.modelValue, () => nextTick(fit))
onMounted(fit)
defineExpose({ focus: () => el.value?.focus() })
</script>

<template>
  <textarea
    ref="el"
    class="lined hand"
    :class="{ dashed }"
    :value="modelValue"
    :placeholder="placeholder"
    :rows="rows"
    @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  />
</template>

<style scoped>
.lined {
  display: block;
  width: 100%;
  margin: 0;
  padding: 0 2px;
  border: 0;
  outline: none;
  resize: none;
  overflow: hidden;
  font-size: 19px;
  line-height: 34px;
  color: var(--ink);
  caret-color: var(--pen);
  background: transparent linear-gradient(to bottom, transparent 33px, var(--line) 33px) 0 0 / 100% 34px;
}
.lined.dashed {
  background: transparent
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='34'%3E%3Crect y='33' width='4.5' height='1' fill='%23dfcdc1'/%3E%3C/svg%3E")
    0 0 / 8px 34px;
}
.lined::placeholder {
  color: var(--ink-3);
  opacity: 0.8;
}
</style>
