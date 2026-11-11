<!-- 看一页记录 -->
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CrisisNote from '../components/CrisisNote.vue'
import Icon from '../components/Icon.vue'
import Mini from '../components/Mini.vue'
import NotebookPage from '../components/NotebookPage.vue'
import { deleteEntry, getEntry, isDone } from '../store'
import { confirmDialog, toast } from '../ui'
import { fmtDay, hasCrisisSignal } from '../utils'

const route = useRoute()
const router = useRouter()
const entry = computed(() => getEntry(String(route.params.id)))
const done = computed(() => !!entry.value && isDone(entry.value))
const crisis = computed(() => !!entry.value && hasCrisisSignal(entry.value.situation, entry.value.thought, entry.value.reframe))

function back() {
  if (window.history.state?.back) router.back()
  else router.replace('/')
}

function edit(step = 0) {
  router.push({ path: `/write/${entry.value!.id}`, query: { step } })
}

function continueIt() {
  const e = entry.value!
  edit(!e.situation.trim() ? 0 : !e.thought.trim() ? 1 : e.before === null ? 2 : !e.reframe.trim() ? 3 : 4)
}

async function remove() {
  const ok = await confirmDialog({
    title: '撕掉这一页？',
    message: '删掉之后就找不回来了。',
    ok: '删掉',
    cancel: '留着',
    danger: true,
    figure: entry.value!.buddy,
  })
  if (!ok) return
  deleteEntry(entry.value!.id)
  toast('这一页已经删掉了')
  router.replace('/')
}
</script>

<template>
  <div class="page full">
    <div class="topbar">
      <button class="icon-btn" aria-label="返回" @click="back"><Icon name="back" /></button>
      <span class="title">{{ entry ? fmtDay(entry.happenedAt) : '' }}</span>
      <template v-if="entry">
        <button class="icon-btn" aria-label="编辑" @click="edit()"><Icon name="edit" /></button>
        <button class="icon-btn" aria-label="删除" @click="remove"><Icon name="trash" /></button>
      </template>
    </div>

    <template v-if="entry">
      <div v-if="!done" class="pending patch" :style="{ '--bg': 'var(--g-butter)' }">
        <Mini name="pig" :size="54" />
        <div class="pending-text">
          <p class="hand">这一页还没整理完</p>
          <p class="muted">有力气的时候，再回来换个角度看看。</p>
        </div>
        <button class="btn small" @click="continueIt">继续</button>
      </div>

      <NotebookPage :entry="entry" class="nb" />
      <CrisisNote v-if="crisis" class="crisis" />
    </template>

    <div v-else class="missing">
      <Mini name="sheep" :size="90" />
      <p class="hand">这一页找不到了</p>
      <button class="btn small" @click="router.replace('/')">回到记录本</button>
    </div>
  </div>
</template>

<style scoped>
.pending {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  margin-bottom: 14px;
}
.pending-text {
  flex: 1;
  min-width: 0;
}
.pending-text .hand {
  font-size: 17px;
}
.pending-text .muted {
  font-size: 12px;
}
.pending .btn {
  position: relative;
  z-index: 1;
}
.nb {
  margin-top: 34px;
}
.crisis {
  margin-top: 18px;
}
.missing {
  display: grid;
  justify-items: center;
  gap: 12px;
  margin-top: 80px;
}
.missing .hand {
  font-size: 20px;
}
</style>
