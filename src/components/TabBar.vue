<!-- 底部的布条导航 -->
<script setup lang="ts">
import { useRoute } from 'vue-router'
import Icon, { type IconName } from './Icon.vue'

const route = useRoute()
const tabs: { to: string; icon: IconName; label: string }[] = [
  { to: '/', icon: 'notebook', label: '记录本' },
  { to: '/cards', icon: 'cards', label: '重启卡' },
  { to: '/me', icon: 'heart', label: '我的' },
]
</script>

<template>
  <nav class="tabbar patch light">
    <RouterLink v-for="t in tabs" :key="t.to" :to="t.to" class="tab" :class="{ on: route.path === t.to }" replace>
      <span class="pill"><Icon :name="t.icon" /></span>
      <span class="label">{{ t.label }}</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.tabbar {
  --radius: 28px;
  --bg: linear-gradient(170deg, #fffbf7, #f5ebe2);
  position: fixed;
  z-index: 20;
  left: 50%;
  bottom: calc(var(--sab) + 10px);
  transform: translateX(-50%);
  width: calc(min(100vw, 480px) - 28px);
  height: var(--tabbar-h);
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 10px;
}
.tab {
  flex: 1;
  display: grid;
  justify-items: center;
  gap: 1px;
  padding: 6px 0;
  color: var(--ink-3);
  text-decoration: none;
  font-size: 11px;
  letter-spacing: 0.08em;
  position: relative;
  z-index: 1;
}
.pill {
  width: 46px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  transition: background 0.25s;
}
.pill svg {
  width: 22px;
  height: 22px;
}
.tab.on {
  color: #8a5560;
}
.tab.on .pill {
  background: var(--grain), var(--g-rose);
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.7);
}
</style>
