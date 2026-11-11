<!-- 写完一页之后 -->
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CrisisNote from '../components/CrisisNote.vue'
import Mini from '../components/Mini.vue'
import { FIGURES, type FigureId } from '../data/figures'
import { getEntry } from '../store'
import { changeMessage, hasCrisisSignal, scoreBg } from '../utils'

const route = useRoute()
const router = useRouter()
const entry = computed(() => getEntry(String(route.params.id)))
const msg = computed(() => (entry.value ? changeMessage(entry.value.before, entry.value.after) : ''))
const crisis = computed(() => !!entry.value && hasCrisisSignal(entry.value.situation, entry.value.thought, entry.value.reframe))
</script>

<template>
  <div class="page full done">
    <template v-if="entry">
      <div class="hero">
        <Mini name="baker" :size="136" float />
        <h1 class="hand">这一页收好了</h1>
        <p class="muted">辛苦了，给自己一点甜。</p>
      </div>

      <div v-if="entry.before !== null && entry.after !== null" class="change patch light">
        <div class="col">
          <span class="kicker">写之前</span>
          <b class="hand" :style="{ '--bg': scoreBg(entry.before) }">{{ entry.before }}</b>
        </div>
        <svg viewBox="0 0 60 20" aria-hidden="true"><path d="M2 11c14-6 30-6 52-1M47 4l8 6-8 6" /></svg>
        <div class="col">
          <span class="kicker">写之后</span>
          <b class="hand" :style="{ '--bg': scoreBg(entry.after) }">{{ entry.after }}</b>
        </div>
      </div>
      <p v-if="msg" class="msg hand">{{ msg }}</p>

      <div class="buddy patch" :style="{ '--bg': 'var(--g-mint)' }">
        <Mini :name="entry.buddy" :size="70" float />
        <p>
          今天陪着你的是<b>{{ FIGURES[entry.buddy as FigureId] }}</b>。<br />
          它会一直待在这一页上。
        </p>
      </div>

      <CrisisNote v-if="crisis" class="crisis" />

      <div class="actions">
        <button class="btn block" @click="router.replace(`/entry/${entry.id}`)">看看这一页</button>
        <button class="btn soft block" @click="router.replace('/')">回到记录本</button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.done {
  padding-top: calc(var(--sat) + 40px);
}
.hero {
  display: grid;
  justify-items: center;
  text-align: center;
  gap: 6px;
}
.hero h1 {
  margin-top: 10px;
  font-size: 30px;
  font-weight: 400;
}
.change {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  margin-top: 26px;
  padding: 18px;
}
.col {
  display: grid;
  justify-items: center;
  gap: 6px;
}
.col b {
  width: 62px;
  height: 62px;
  display: grid;
  place-items: center;
  border-radius: 18px;
  font-size: 34px;
  font-weight: 400;
  background: var(--grain), var(--bg);
  box-shadow: inset 0 0 0 1.5px rgb(255 255 255 / 0.8), var(--shadow-soft);
}
.change svg {
  width: 60px;
  margin-top: 22px;
  fill: none;
  stroke: #e3a2aa;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.msg {
  margin: 16px 10px 0;
  font-size: 18px;
  line-height: 1.7;
  text-align: center;
  color: #6b5a5f;
}
.buddy {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 22px;
  padding: 16px 18px;
}
.buddy p {
  font-size: 14px;
  line-height: 1.8;
  color: #4e5d58;
}
.buddy b {
  margin: 0 2px;
  font-family: var(--font-hand);
  font-size: 16px;
}
.crisis {
  margin-top: 18px;
}
.actions {
  display: grid;
  gap: 12px;
  margin-top: 28px;
}
</style>
