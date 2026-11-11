<script setup lang="ts">
import { useRoute } from 'vue-router'
import Overlays from './components/Overlays.vue'
import TabBar from './components/TabBar.vue'

const route = useRoute()
</script>

<template>
  <RouterView v-slot="{ Component, route: r }">
    <Transition name="page" mode="out-in">
      <component :is="Component" :key="r.path" />
    </Transition>
  </RouterView>
  <TabBar v-if="route.meta.tab" />
  <Overlays />
</template>
