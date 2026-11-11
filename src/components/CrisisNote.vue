<!-- 需要更多帮助时的提示 -->
<script setup lang="ts">
import Icon from './Icon.vue'
import Mini from './Mini.vue'
</script>

<template>
  <aside class="crisis patch">
    <div class="who">
      <Mini name="bear" :size="62" />
    </div>
    <div class="body">
      <h4 class="hand">你不必一个人扛着</h4>
      <p>如果你现在很难熬，甚至有伤害自己的念头，请告诉身边信任的人，或者打个电话给专业的人：</p>
      <a href="tel:12356"><Icon name="phone" />全国心理援助热线 12356</a>
      <a href="tel:4001619995"><Icon name="phone" />希望24热线 400-161-9995</a>
      <p class="small">遇到紧急危险，请立即拨打 110 或 120。</p>
    </div>
  </aside>
</template>

<style scoped>
.crisis {
  --bg: var(--g-sky);
  display: flex;
  gap: 12px;
  padding: 18px 18px 18px 14px;
}
.who {
  flex: none;
  padding-top: 4px;
}
h4 {
  font-size: 19px;
  font-weight: 400;
  color: #45535f;
}
p {
  margin-top: 4px;
  font-size: 13px;
  line-height: 1.7;
  color: #5b6670;
}
a {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #3f5466;
  text-decoration: none;
  background: rgb(255 255 255 / 0.65);
}
a svg {
  width: 16px;
  height: 16px;
  flex: none;
}
.small {
  font-size: 12px;
  margin-top: 8px;
}
</style>
