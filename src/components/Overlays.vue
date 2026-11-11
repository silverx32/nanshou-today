<!-- 全局的 toast 和确认框 -->
<script setup lang="ts">
import { confirmState, settleConfirm, toastState } from '../ui'
import Mini from './Mini.vue'
</script>

<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="toastState.show" class="toast" role="status">{{ toastState.text }}</div>
    </Transition>

    <Transition name="fade">
      <div v-if="confirmState.open" class="mask" @click.self="settleConfirm(false)">
        <div class="dialog patch light" role="alertdialog" aria-modal="true" :aria-label="confirmState.opts.title">
          <Mini v-if="confirmState.opts.figure" class="fig" :name="confirmState.opts.figure" :size="72" />
          <h3 class="hand">{{ confirmState.opts.title }}</h3>
          <p v-if="confirmState.opts.message">{{ confirmState.opts.message }}</p>
          <div class="actions">
            <button class="btn soft" @click="settleConfirm(false)">{{ confirmState.opts.cancel ?? '再想想' }}</button>
            <button
              class="btn"
              :style="{ '--bg': confirmState.opts.danger ? 'var(--g-rose)' : 'var(--g-sage)' }"
              @click="settleConfirm(true)"
            >
              {{ confirmState.opts.ok ?? '好的' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.toast {
  position: fixed;
  z-index: 80;
  top: calc(var(--sat) + 16px);
  left: 50%;
  transform: translateX(-50%);
  width: max-content;
  max-width: 86vw;
  padding: 10px 20px;
  border-radius: 999px;
  font-size: 14px;
  color: #fff;
  background: rgb(92 72 76 / 0.88);
  box-shadow: var(--shadow-soft);
}
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.25s, transform 0.25s;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -10px);
}

.mask {
  position: fixed;
  z-index: 70;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgb(84 62 62 / 0.3);
  backdrop-filter: blur(3px);
}
.dialog {
  --bg: linear-gradient(170deg, #fffbf7, #f6ece3);
  width: min(340px, 100%);
  padding: 26px 22px 22px;
  text-align: center;
}
.fig {
  margin: -62px auto 6px;
}
h3 {
  font-size: 21px;
  font-weight: 400;
}
p {
  margin-top: 8px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--ink-2);
}
.actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 20px;
}
.actions .btn {
  padding: 0 12px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
