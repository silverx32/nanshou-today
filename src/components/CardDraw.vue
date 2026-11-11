<!-- 抽一张重启卡：先看到背面，再翻过来 -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { CARDS, type RestartCard } from '../data/cards'
import CardBack from './CardBack.vue'
import CardFace from './CardFace.vue'
import Icon from './Icon.vue'

const props = withDefaults(defineProps<{ exclude?: string[]; actionText?: string }>(), {
  exclude: () => [],
  actionText: '用这张卡',
})
const emit = defineEmits<{ use: [string] }>()

function pick(notId?: string): RestartCard {
  let pool = CARDS.filter((c) => c.id !== notId && !props.exclude.includes(c.id))
  if (!pool.length) pool = CARDS.filter((c) => c.id !== notId)
  return pool[Math.floor(Math.random() * pool.length)]
}

const card = ref(pick())
const flipped = ref(false)
const busy = ref(false)

onMounted(() => setTimeout(() => (flipped.value = true), 380))

function again() {
  if (busy.value) return
  busy.value = true
  flipped.value = false
  setTimeout(() => {
    card.value = pick(card.value.id)
    flipped.value = true
    busy.value = false
  }, 480)
}
</script>

<template>
  <div class="draw">
    <div class="scene">
      <div class="flip" :class="{ flipped }">
        <div class="face back"><CardBack /></div>
        <div class="face front">
          <CardFace :card="card" size="lg">
            <p class="tip">{{ card.tip }}</p>
          </CardFace>
        </div>
      </div>
    </div>
    <div class="actions">
      <button class="btn soft" :disabled="busy" @click="again"><Icon name="shuffle" class="i" />换一张</button>
      <button class="btn" :disabled="!flipped" @click="emit('use', card.id)">{{ actionText }}</button>
    </div>
  </div>
</template>

<style scoped>
.scene {
  perspective: 1400px;
  padding: 4px 4px 0;
}
.flip {
  display: grid;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.3, 0.7, 0.2, 1);
}
.flip.flipped {
  transform: rotateY(180deg);
}
.face {
  grid-area: 1 / 1;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.front {
  transform: rotateY(180deg);
}
.tip {
  margin-top: 14px;
  font-size: 13.5px;
  line-height: 1.7;
  color: rgb(90 71 76 / 0.75);
  text-align: left;
}
.actions {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 12px;
  margin-top: 18px;
}
.i {
  width: 18px;
  height: 18px;
}
</style>
