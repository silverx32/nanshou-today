<!-- 从底部滑出来的布面板 -->
<script setup lang="ts">
import { onUnmounted, watch } from 'vue'
import { onBack } from '../ui'
import Icon from './Icon.vue'

const props = defineProps<{ open: boolean; title?: string }>()
const emit = defineEmits<{ close: [] }>()

// 打开时锁住背后的页面滚动，安卓返回键先关掉面板
let offBack: (() => void) | undefined
watch(
  () => props.open,
  (open) => {
    document.body.classList.toggle('sheet-open', open)
    offBack?.()
    offBack = open ? onBack(() => emit('close')) : undefined
  },
  { immediate: true },
)
onUnmounted(() => {
  document.body.classList.remove('sheet-open')
  offBack?.()
})
</script>

<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="open" class="backdrop" @click.self="emit('close')">
        <div class="sheet" role="dialog" aria-modal="true" :aria-label="title">
          <div class="head">
            <h3 v-if="title" class="hand">{{ title }}</h3>
            <button class="icon-btn" aria-label="关闭" @click="emit('close')"><Icon name="close" /></button>
          </div>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgb(84 62 62 / 0.28);
  backdrop-filter: blur(3px);
}
.sheet {
  position: relative;
  width: 100%;
  max-width: 480px;
  max-height: 92dvh;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 14px 18px calc(var(--sab) + 22px);
  border-radius: 28px 28px 0 0;
  background: var(--grain), var(--weave), linear-gradient(175deg, #fffaf5, #f6ece4);
  box-shadow: 0 -10px 30px -12px rgb(120 86 76 / 0.4);
}
.sheet::before {
  content: '';
  position: absolute;
  left: 8px;
  right: 8px;
  top: 8px;
  height: 40px;
  border: 1.5px dashed rgb(176 146 134 / 0.35);
  border-bottom: 0;
  border-radius: 22px 22px 0 0;
  pointer-events: none;
}
.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 42px;
  margin-bottom: 8px;
}
.head h3 {
  font-size: 20px;
  font-weight: 400;
  padding-left: 6px;
}
.head .icon-btn {
  margin-left: auto;
  width: 36px;
  height: 36px;
}

.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.25s ease;
}
.sheet-enter-active .sheet,
.sheet-leave-active .sheet {
  transition: transform 0.32s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}
.sheet-enter-from .sheet,
.sheet-leave-to .sheet {
  transform: translateY(100%);
}
</style>
