<!-- 情绪重启卡的正面 -->
<script setup lang="ts">
import { cardNo, groupName, type RestartCard } from '../data/cards'
import Mini from './Mini.vue'

withDefaults(defineProps<{ card: RestartCard; size?: 'sm' | 'lg' }>(), { size: 'sm' })
</script>

<template>
  <article class="card patch" :class="size" :style="{ '--bg': card.bg }">
    <header>
      <span>{{ cardNo(card) }}</span>
      <span>{{ groupName(card.group) }}</span>
    </header>
    <div class="stage">
      <span class="badge" />
      <Mini :name="card.figure" :size="size === 'lg' ? 132 : 80" :float="size === 'lg'" />
    </div>
    <h3 class="hand">{{ card.title }}</h3>
    <p class="q hand">{{ card.question }}</p>
    <slot />
  </article>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 16px 14px 18px;
  color: #5a474c;
}
header {
  align-self: stretch;
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  letter-spacing: 0.08em;
  color: rgb(90 71 76 / 0.6);
  padding: 0 4px;
}
.stage {
  position: relative;
  display: grid;
  place-items: end center;
  margin: 6px 0 4px;
}
.badge {
  position: absolute;
  left: 50%;
  bottom: 2px;
  width: 92px;
  height: 92px;
  transform: translateX(-50%);
  border-radius: 50%;
  background: radial-gradient(circle at 40% 35%, rgb(255 255 255 / 0.9), rgb(255 255 255 / 0.45));
  box-shadow: inset 0 0 0 5px rgb(255 255 255 / 0.25);
}
.badge::after {
  content: '';
  position: absolute;
  inset: 5px;
  border-radius: 50%;
  border: 1.3px dashed rgb(176 146 134 / 0.35);
}
.stage :deep(.mini) {
  position: relative;
}
h3 {
  font-size: 20px;
  font-weight: 400;
  line-height: 1.3;
  margin-top: 4px;
}
.q {
  margin-top: 6px;
  font-size: 13px;
  line-height: 1.55;
  color: rgb(90 71 76 / 0.85);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.lg {
  padding: 20px 22px 24px;
}
.lg header {
  font-size: 12px;
}
.lg .badge {
  width: 150px;
  height: 150px;
}
.lg h3 {
  font-size: 30px;
  margin-top: 8px;
}
.lg .q {
  font-size: 19px;
  line-height: 1.6;
  margin-top: 8px;
  -webkit-line-clamp: unset;
  color: #5a474c;
}
</style>
