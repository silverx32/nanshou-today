<!-- 22 张情绪重启卡 -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import BottomSheet from '../components/BottomSheet.vue'
import Breathe from '../components/Breathe.vue'
import CardBack from '../components/CardBack.vue'
import CardDraw from '../components/CardDraw.vue'
import CardFace from '../components/CardFace.vue'
import Icon from '../components/Icon.vue'
import { CARD_GROUPS, CARDS, type CardGroup, type RestartCard } from '../data/cards'

const router = useRouter()
const filter = ref<CardGroup | 'all'>('all')
const tabs = [{ key: 'all' as const, name: '全部', desc: '' }, ...CARD_GROUPS]
const shown = computed(() => (filter.value === 'all' ? CARDS : CARDS.filter((c) => c.group === filter.value)))
const desc = computed(() => CARD_GROUPS.find((g) => g.key === filter.value)?.desc ?? '卡住的时候，随便翻翻，总有一张适合现在的你。')

const open = ref<RestartCard | null>(null)
const drawing = ref(false)

function writeWith(id: string) {
  open.value = null
  drawing.value = false
  router.push({ path: '/write', query: { card: id } })
}
</script>

<template>
  <div class="page">
    <header class="head">
      <div class="head-text">
        <p class="kicker">{{ CARDS.length }} 张小卡片</p>
        <h1 class="hand">情绪重启卡</h1>
        <p class="muted">难受得转不过弯的时候，抽一张，<br />陪自己换个角度看看。</p>
        <button class="btn small draw" @click="drawing = true"><Icon name="shuffle" class="i" />抽一张</button>
      </div>
      <button class="deck" aria-label="抽一张情绪重启卡" @click="drawing = true">
        <span class="c c3"><CardBack mini /></span>
        <span class="c c2"><CardBack mini /></span>
        <span class="c c1"><CardBack mini /></span>
      </button>
    </header>

    <div class="filters" role="tablist">
      <button
        v-for="t in tabs"
        :key="t.key"
        role="tab"
        :aria-selected="filter === t.key"
        :class="{ on: filter === t.key }"
        @click="filter = t.key"
      >
        {{ t.name }}
      </button>
    </div>
    <p class="desc">{{ desc }}</p>

    <div class="grid">
      <button v-for="c in shown" :key="c.id" class="cell" @click="open = c">
        <CardFace :card="c" />
      </button>
    </div>

    <BottomSheet :open="!!open" @close="open = null">
      <template v-if="open">
        <CardFace :card="open" size="lg" />
        <div class="detail">
          <h4>为什么这样问</h4>
          <p>{{ open.tip }}</p>
          <h4>可以这样想</h4>
          <p class="hand eg">{{ open.example }}</p>
          <Breathe v-if="open.id === 'breathe'" class="breathe" />
          <button class="btn block go" @click="writeWith(open.id)">带着这张卡去记录</button>
        </div>
      </template>
    </BottomSheet>

    <BottomSheet :open="drawing" title="抽一张情绪重启卡" @close="drawing = false">
      <CardDraw v-if="drawing" action-text="带着它去记录" @use="writeWith" />
    </BottomSheet>
  </div>
</template>

<style scoped>
.head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0 8px 4px;
}
.head-text {
  flex: 1;
  min-width: 0;
}
.head h1 {
  margin-top: 4px;
  font-size: 30px;
  font-weight: 400;
}
.head .muted {
  margin-top: 8px;
  font-size: 13.5px;
  line-height: 1.7;
}
.draw {
  margin-top: 14px;
  --bg: var(--g-lilac);
}
.i {
  width: 17px;
  height: 17px;
}

.deck {
  position: relative;
  flex: none;
  width: 128px;
  height: 172px;
  margin-right: 4px;
  padding: 0;
  border: 0;
  background: none;
}
.c {
  position: absolute;
  inset: 6px 14px;
  transition: transform 0.3s;
}
.c :deep(.back) {
  min-height: 0;
  height: 100%;
}
.c1 {
  transform: rotate(-6deg);
}
.c2 {
  transform: rotate(3deg) translate(4px, -2px);
}
.c3 {
  transform: rotate(10deg) translate(8px, 0);
}
.deck:active .c1 {
  transform: rotate(-10deg) translateY(-6px);
}

.filters {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  margin: 18px -18px 0;
  padding: 4px 18px 6px;
  scrollbar-width: none;
}
.filters::-webkit-scrollbar {
  display: none;
}
.filters button {
  flex: none;
  height: 34px;
  padding: 0 16px;
  border: 0;
  border-radius: 999px;
  font-size: 14px;
  color: var(--ink-2);
  background: rgb(255 255 255 / 0.55);
  box-shadow: inset 0 0 0 1px rgb(176 146 134 / 0.2);
}
.filters button.on {
  color: #7d4c56;
  background: var(--grain), var(--g-rose);
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.7), 0 3px 8px -4px rgb(120 86 76 / 0.35);
}
.desc {
  margin: 10px 4px 16px;
  font-size: 13px;
  color: var(--ink-3);
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.cell {
  padding: 0;
  border: 0;
  background: none;
  text-align: inherit;
  transition: transform 0.15s;
}
.cell:active {
  transform: scale(0.97);
}
.cell :deep(.card) {
  height: 100%;
}

.detail {
  padding: 18px 6px 0;
}
.detail h4 {
  margin-top: 14px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--ink-3);
}
.detail h4:first-child {
  margin-top: 0;
}
.detail p {
  margin-top: 6px;
  font-size: 14.5px;
  line-height: 1.8;
  color: var(--ink-2);
}
.detail .eg {
  font-size: 17px;
  color: var(--ink);
}
.breathe {
  margin-top: 18px;
}
.go {
  margin-top: 22px;
}
</style>
