<!-- 我的：回顾、备份、关于 -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import CrisisNote from '../components/CrisisNote.vue'
import Icon from '../components/Icon.vue'
import Mini from '../components/Mini.vue'
import { getCard, type RestartCard } from '../data/cards'
import { backupJSON, clearAll, entries, isDone, restoreJSON, type Entry } from '../store'
import { confirmDialog, shareFile, toast } from '../ui'
import { fmtDate, fmtDay } from '../utils'

type Scored = Entry & { before: number; after: number }

const all = entries
const doneCount = computed(() => all.value.filter(isDone).length)
const scored = computed(() => all.value.filter((e): e is Scored => e.before !== null && e.after !== null))
const avgDrop = computed(() => {
  const s = scored.value
  return s.length ? s.reduce((sum, e) => sum + (e.before - e.after), 0) / s.length : null
})

// ---------- 最近的情绪变化（哑铃图） ----------
const recent = computed(() => scored.value.slice(0, 8))
const activeId = ref('')
const active = computed(() => recent.value.find((e) => e.id === activeId.value) ?? recent.value[0])
const showTable = ref(false)
const shortDay = (ts: number) => fmtDay(ts).split(' ')[0]

// ---------- 最常出现的情绪 ----------
const topEmotions = computed(() => {
  const counts = new Map<string, number>()
  for (const e of all.value) for (const w of e.emotions) counts.set(w, (counts.get(w) ?? 0) + 1)
  return [...counts].sort((a, b) => b[1] - a[1]).slice(0, 5)
})
const maxEmotion = computed(() => topEmotions.value[0]?.[1] ?? 1)

// ---------- 最常用的重启卡 ----------
const topCards = computed(() => {
  const counts = new Map<string, number>()
  for (const e of all.value) for (const id of e.cards) counts.set(id, (counts.get(id) ?? 0) + 1)
  return [...counts]
    .map(([id, n]) => ({ card: getCard(id), n }))
    .filter((x): x is { card: RestartCard; n: number } => !!x.card)
    .sort((a, b) => b.n - a.n)
    .slice(0, 3)
})

// ---------- 备份 ----------
const fileInput = ref<HTMLInputElement>()

async function exportBackup() {
  if (!all.value.length) return toast('还没有记录可以备份')
  try {
    await shareFile(`我今天又难受了-备份-${fmtDate(Date.now()).replaceAll('.', '')}.json`, backupJSON())
  } catch {
    toast('没能导出，再试一次吧')
  }
}

async function importBackup(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  try {
    const n = restoreJSON(await file.text())
    toast(n ? `导入了 ${n} 页记录` : '这些记录都已经在了')
  } catch {
    toast('这个文件好像不是备份文件')
  }
}

async function wipe() {
  const ok = await confirmDialog({
    title: '清空所有记录？',
    message: `${all.value.length} 页记录会全部删掉，找不回来。建议先导出一份备份。`,
    ok: '全部清空',
    cancel: '先不了',
    danger: true,
    figure: 'hedgehog',
  })
  if (!ok) return
  clearAll()
  toast('记录本已经清空了')
}

const aboutOpen = ref(false)
</script>

<template>
  <div class="page me">
    <header class="head">
      <div>
        <p class="kicker">回顾一下</p>
        <h1 class="hand">我的记录本</h1>
        <p class="muted">
          <template v-if="all.length">你已经认真地停下来看了自己 {{ all.length }} 次。</template>
          <template v-else>写下第一页之后，这里会慢慢长出你的变化。</template>
        </p>
      </div>
      <Mini name="coder" :size="88" float />
    </header>

    <!-- 三个数字 -->
    <div class="kpis">
      <div class="kpi patch light">
        <span class="label">记录了</span>
        <span class="value">{{ all.length }}<small>页</small></span>
      </div>
      <div class="kpi patch light">
        <span class="label">完成重构</span>
        <span class="value">{{ doneCount }}<small>页</small></span>
      </div>
      <div class="kpi patch light">
        <span class="label">平均缓解</span>
        <span class="value">{{ avgDrop === null ? '–' : avgDrop.toFixed(1) }}<small v-if="avgDrop !== null">分</small></span>
      </div>
    </div>

    <!-- 最近的情绪变化 -->
    <section class="panel patch light">
      <div class="panel-head">
        <h2>最近的情绪变化</h2>
        <button v-if="recent.length" class="toggle" :aria-pressed="showTable" @click="showTable = !showTable">
          {{ showTable ? '看图' : '看表格' }}
        </button>
      </div>

      <template v-if="recent.length">
        <div class="legend">
          <span><i class="dot before" />写之前</span>
          <span><i class="dot after" />写之后</span>
        </div>

        <template v-if="!showTable">
          <p v-if="active" class="readout" aria-live="polite">
            <b>{{ active.before }} → {{ active.after }}</b>
            <span>{{ fmtDay(active.happenedAt) }}</span>
          </p>
          <div class="dumbbell">
            <button
              v-for="e in recent"
              :key="e.id"
              class="db-row"
              :class="{ on: e.id === active?.id }"
              :aria-label="`${fmtDay(e.happenedAt)}，写之前 ${e.before} 分，写之后 ${e.after} 分`"
              @click="activeId = e.id"
              @focus="activeId = e.id"
            >
              <span class="db-label">{{ shortDay(e.happenedAt) }}</span>
              <span class="db-plot">
                <i class="grid" style="left: 0" /><i class="grid" style="left: 50%" /><i class="grid" style="left: 100%" />
                <i
                  class="bar"
                  :style="{ left: `${Math.min(e.before, e.after) * 10}%`, width: `${Math.abs(e.before - e.after) * 10}%` }"
                />
                <i class="dot before" :style="{ left: `${e.before * 10}%` }" />
                <i class="dot after" :style="{ left: `${e.after * 10}%` }" />
              </span>
            </button>
            <div class="db-axis">
              <span />
              <span class="ticks"><b style="left: 0">0</b><b style="left: 50%">5</b><b style="left: 100%">10</b></span>
            </div>
          </div>
        </template>

        <table v-else class="table">
          <thead>
            <tr><th>日期</th><th>写之前</th><th>写之后</th><th>变化</th></tr>
          </thead>
          <tbody>
            <tr v-for="e in recent" :key="e.id">
              <td>{{ shortDay(e.happenedAt) }}</td>
              <td>{{ e.before }}</td>
              <td>{{ e.after }}</td>
              <td>{{ e.after - e.before > 0 ? '+' : '' }}{{ e.after - e.before }}</td>
            </tr>
          </tbody>
        </table>
      </template>
      <p v-else class="empty">写完一页并打两次分之后，这里会出现你的情绪变化。</p>
    </section>

    <!-- 最常出现的情绪 -->
    <section class="panel patch light">
      <div class="panel-head"><h2>最常出现的情绪</h2></div>
      <div v-if="topEmotions.length" class="bars">
        <div v-for="[w, n] in topEmotions" :key="w" class="bar-row">
          <span class="bar-label hand">{{ w }}</span>
          <span class="bar-track">
            <i class="bar-fill" :style="{ width: `${(n / maxEmotion) * 82}%` }" />
            <b>{{ n }}</b>
          </span>
        </div>
      </div>
      <p v-else class="empty">圈过的情绪会在这里排排队。</p>
    </section>

    <!-- 最常用的重启卡 -->
    <section v-if="topCards.length" class="panel patch light">
      <div class="panel-head"><h2>最常陪你的重启卡</h2></div>
      <div class="top-cards">
        <div v-for="{ card, n } in topCards" :key="card.id" class="tc" :style="{ '--bg': card.bg }">
          <Mini :name="card.figure" :size="54" />
          <span class="hand">{{ card.title }}</span>
          <small>{{ n }} 次</small>
        </div>
      </div>
    </section>

    <!-- 备份 -->
    <section class="panel patch light">
      <div class="panel-head"><h2>备份与数据</h2></div>
      <p class="note">记录只保存在这台手机里，App 不会把它们上传到任何地方。换手机或清理数据之前，记得先导出一份备份。</p>
      <div class="data-actions">
        <button class="btn small" :style="{ '--bg': 'var(--g-mint)' }" @click="exportBackup"><Icon name="download" class="i" />导出备份</button>
        <button class="btn small" :style="{ '--bg': 'var(--g-sky)' }" @click="fileInput?.click()"><Icon name="upload" class="i" />导入备份</button>
      </div>
      <!-- 不限制文件类型：有些文件管理器把 .json 标成未知类型，内容会在导入时校验 -->
      <input ref="fileInput" type="file" hidden @change="importBackup" />
      <button v-if="all.length" class="text-btn danger" @click="wipe">清空所有记录</button>
    </section>

    <!-- 关于 -->
    <section class="panel patch light about">
      <button class="about-head" :aria-expanded="aboutOpen" @click="aboutOpen = !aboutOpen">
        <h2>什么是认知重构？</h2>
        <Icon name="next" class="chev" :class="{ open: aboutOpen }" />
      </button>
      <div v-if="aboutOpen" class="about-body">
        <p>认知重构是认知行为疗法（CBT）里很常用的方法。它来自一个简单的发现：让我们难受的，往往不只是事情本身，还有我们怎么看这件事。</p>
        <ol>
          <li><b>发生了什么事</b>：像旁观者一样，写下客观的事实。</li>
          <li><b>是什么想法</b>：抓住那一刻自动冒出来的念头。</li>
          <li><b>当时的感受</b>：圈出情绪，给强度打个分。</li>
          <li><b>还可以怎么看</b>：借助情绪重启卡，找到更平衡的想法。</li>
          <li><b>再打一次分</b>：看看情绪有没有松动一点。</li>
        </ol>
        <p>坚持写一段时间，你会慢慢认出自己最常掉进去的思维陷阱，下一次就能更快地爬出来。</p>
        <p class="small">这是一个自助记录工具，不能代替专业的心理咨询或治疗。如果难受的感觉持续很久、影响到了生活，请寻求专业的帮助。</p>
      </div>
    </section>

    <CrisisNote class="crisis" />

    <p class="footer">我今天又难受了 · v1.0.0<br />愿你每一次难受，都被温柔接住。</p>
  </div>
</template>

<style scoped>
.head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 0 4px 4px;
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

.kpis {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 18px;
}
.kpi {
  --radius: 18px;
  display: grid;
  gap: 2px;
  padding: 14px 14px 12px;
}
.kpi::after {
  inset: 5px;
  border-radius: 13px;
}
.label {
  font-size: 12px;
  color: var(--ink-2);
}
.value {
  font-size: 26px;
  font-weight: 600;
  line-height: 1.2;
  color: var(--ink);
}
.value small {
  margin-left: 2px;
  font-size: 12px;
  font-weight: 400;
  color: var(--ink-3);
}

.panel {
  margin-top: 16px;
  padding: 18px 18px 18px;
}
.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.panel h2 {
  font-size: 15px;
  font-weight: 600;
  color: var(--ink);
}
.toggle {
  position: relative;
  z-index: 1;
  padding: 2px 12px;
  border: 0;
  border-radius: 999px;
  font-size: 12px;
  color: var(--ink-2);
  background: rgb(255 255 255 / 0.8);
  box-shadow: inset 0 0 0 1px rgb(176 146 134 / 0.25);
}
.empty {
  font-size: 13px;
  color: var(--ink-3);
  line-height: 1.7;
}

/* 哑铃图：同一色相的两个深浅，浅 = 写之前，深 = 写之后 */
.legend {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: var(--ink-2);
}
.legend span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.legend .dot {
  position: static;
  transform: none;
}
.readout {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin: 10px 0 4px;
}
.readout b {
  font-size: 18px;
  font-weight: 600;
  color: var(--ink);
}
.readout span {
  font-size: 12px;
  color: var(--ink-3);
}
.dumbbell {
  position: relative;
  z-index: 1;
}
.db-row,
.db-axis {
  width: 100%;
  display: grid;
  grid-template-columns: 68px 1fr;
  align-items: center;
}
.db-row {
  height: 30px;
  padding: 0 12px 0 0;
  border: 0;
  border-radius: 8px;
  background: none;
  font: inherit;
  text-align: left;
}
.db-row.on {
  background: rgb(232 161 172 / 0.12);
}
.db-label {
  white-space: nowrap;
  padding-left: 6px;
  font-size: 12px;
  color: var(--ink-2);
  font-variant-numeric: tabular-nums;
}
.db-plot {
  position: relative;
  height: 100%;
}
.grid {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--line);
}
.bar {
  position: absolute;
  top: 50%;
  height: 2px;
  margin-top: -1px;
  background: #dccbc4;
}
.dot {
  position: absolute;
  top: 50%;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 0 2px #fffbf6;
}
.dot.before {
  background: #e8a1ac;
}
.dot.after {
  background: #a8505f;
}
.legend .dot {
  display: inline-block;
}
.db-axis {
  padding-right: 12px;
  margin-top: 2px;
}
.ticks {
  position: relative;
  height: 16px;
}
.ticks b {
  position: absolute;
  transform: translateX(-50%);
  font-size: 11px;
  font-weight: 400;
  color: var(--ink-3);
  font-variant-numeric: tabular-nums;
}
.table {
  width: 100%;
  margin-top: 10px;
  border-collapse: collapse;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
}
.table th,
.table td {
  padding: 6px 4px;
  text-align: center;
  border-bottom: 1px solid var(--line);
}
.table th {
  font-weight: 500;
  color: var(--ink-3);
}
.table td:first-child,
.table th:first-child {
  text-align: left;
}

/* 横向条形：单一色相，值写在条末端 */
.bars {
  display: grid;
  gap: 8px;
}
.bar-row {
  display: grid;
  grid-template-columns: 76px 1fr;
  align-items: center;
}
.bar-label {
  font-size: 15px;
  color: var(--ink);
}
.bar-track {
  display: flex;
  align-items: center;
  gap: 6px;
}
.bar-fill {
  height: 10px;
  min-width: 4px;
  border-radius: 0 4px 4px 0;
  background: #c96b7b;
}
.bar-track b {
  font-size: 12px;
  font-weight: 600;
  color: var(--ink-2);
}

.top-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.tc {
  display: grid;
  justify-items: center;
  gap: 2px;
  padding: 10px 4px;
  border-radius: 16px;
  background: var(--grain), var(--bg);
}
.tc .hand {
  font-size: 14px;
  text-align: center;
  text-wrap: balance;
}
.tc small {
  font-size: 11px;
  color: var(--ink-2);
}

.note {
  font-size: 13px;
  line-height: 1.7;
  color: var(--ink-2);
}
.data-actions {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 10px;
  margin-top: 14px;
}
.data-actions .btn {
  flex: 1;
  padding: 0 10px;
}
.i {
  width: 17px;
  height: 17px;
}
.danger {
  position: relative;
  z-index: 1;
  margin-top: 8px;
  color: #b0606d;
}

.about-head {
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  border: 0;
  background: none;
  text-align: left;
}
.chev {
  width: 18px;
  height: 18px;
  color: var(--ink-3);
  transition: transform 0.2s;
}
.chev.open {
  transform: rotate(90deg);
}
.about-body {
  margin-top: 10px;
  font-size: 13.5px;
  line-height: 1.8;
  color: var(--ink-2);
}
.about-body ol {
  margin: 8px 0;
  padding-left: 20px;
}
.about-body b {
  color: var(--ink);
  font-weight: 600;
}
.about-body p + p {
  margin-top: 8px;
}
.about-body .small {
  font-size: 12px;
  color: var(--ink-3);
}
.crisis {
  margin-top: 16px;
}
.footer {
  margin-top: 24px;
  font-size: 12px;
  line-height: 1.8;
  text-align: center;
  color: var(--ink-3);
}
</style>
