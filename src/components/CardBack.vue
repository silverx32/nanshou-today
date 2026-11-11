<!-- 情绪重启卡的背面：波点布 -->
<script setup lang="ts">
defineProps<{ mini?: boolean }>()
</script>

<template>
  <div class="back patch" :class="{ mini }">
    <div class="seal">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 20s-7.5-4.6-7.5-10.1A4.4 4.4 0 0 1 12 7.2a4.4 4.4 0 0 1 7.5 2.7C19.5 15.4 12 20 12 20z" />
      </svg>
      <span class="hand">情绪重启卡</span>
    </div>
  </div>
</template>

<style scoped>
.back {
  --bg: radial-gradient(circle, rgb(255 255 255 / 0.55) 2.2px, transparent 2.8px) 0 0 / 18px 18px,
    radial-gradient(circle, rgb(255 255 255 / 0.55) 2.2px, transparent 2.8px) 9px 9px / 18px 18px,
    linear-gradient(150deg, #efe5f7, #f3c9d0);
  height: 100%;
  min-height: 240px;
  display: grid;
  place-items: center;
}
.seal {
  position: relative;
  width: 132px;
  height: 132px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 4px;
  background: var(--grain), linear-gradient(160deg, #fffaf4, #f7ebe2);
  box-shadow: var(--shadow-felt);
}
.seal::after {
  content: '';
  position: absolute;
  inset: 6px;
  border-radius: 50%;
  border: 1.4px dashed rgb(224 124 133 / 0.45);
}
.seal svg {
  width: 36px;
  height: 36px;
  fill: #f2b8bf;
  stroke: #e07c85;
  stroke-width: 1.2;
}
.seal span {
  font-size: 16px;
  color: #8c6a70;
  letter-spacing: 0.1em;
}
.mini {
  --radius: 14px;
}
.mini::after {
  inset: 4px;
  border-radius: 10px;
}
.mini .seal {
  width: 62px;
  height: 62px;
  gap: 0;
}
.mini .seal::after {
  inset: 3px;
}
.mini .seal svg {
  width: 20px;
  height: 20px;
}
.mini .seal span {
  font-size: 9px;
  letter-spacing: 0;
}
</style>
