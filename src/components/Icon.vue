<!-- 线条小图标 -->
<script setup lang="ts">
import type { PropType } from 'vue'

defineProps({ name: { type: String as PropType<IconName>, required: true } })
</script>

<script lang="ts">
const PATHS = {
  close: 'M6 6l12 12M18 6L6 18',
  back: 'M15 5l-7 7 7 7',
  next: 'M9 5l7 7-7 7',
  plus: 'M12 5v14M5 12h14',
  edit: 'M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4zM13.5 6.5l4 4',
  trash: 'M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12M10.5 11v5M13.5 11v5',
  notebook: 'M6 3.5h11a1.5 1.5 0 0 1 1.5 1.5v14a1.5 1.5 0 0 1-1.5 1.5H6zM6 3.5v17M3.5 7.5H6M3.5 12H6M3.5 16.5H6M10 8h5M10 11.5h5',
  cards: 'M8.5 4.5h9a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 7 18V6a1.5 1.5 0 0 1 1.5-1.5zM7 7.2l-2.3.9a1.5 1.5 0 0 0-.8 1.9l3.1 8',
  heart: 'M12 20s-7.5-4.6-7.5-10.1A4.4 4.4 0 0 1 12 7.2a4.4 4.4 0 0 1 7.5 2.7C19.5 15.4 12 20 12 20z',
  shuffle: 'M4 7h3.5c4.5 0 4.5 10 9 10H20M4 17h3.5c1.6 0 2.6-1.2 3.4-2.8M13.1 9.8C13.9 8.2 14.9 7 16.5 7H20M17.5 4.5L20 7l-2.5 2.5M17.5 14.5L20 17l-2.5 2.5',
  clock: 'M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
  download: 'M12 4v11M7.5 10.5L12 15l4.5-4.5M5 19.5h14',
  upload: 'M12 15V4M7.5 8.5L12 4l4.5 4.5M5 19.5h14',
  phone: 'M6.6 3.5h2.6l1.4 4-2 1.5a11 11 0 0 0 6.4 6.4l1.5-2 4 1.4v2.6a1.6 1.6 0 0 1-1.7 1.6A15.6 15.6 0 0 1 5 5.2a1.6 1.6 0 0 1 1.6-1.7z',
  leaf: 'M5 19c0-8 5-13 14-14 0 9-5 14-13 14zM5 19l7-7',
}
export type IconName = keyof typeof PATHS
</script>

<template>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path :d="PATHS[name]" />
  </svg>
</template>
