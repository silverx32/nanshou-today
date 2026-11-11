<!-- 圈出你的情绪。editable 时可以点选（并自己加词）；否则像记录本那页一样，把圈过的词圈出来 -->
<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { CUSTOM_GROUP_BG, EMOTION_GROUPS, groupOf } from '../data/emotions'
import HandCircle from './HandCircle.vue'

const props = defineProps<{ modelValue: string[]; editable?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [string[]] }>()

const customs = computed(() => props.modelValue.filter((w) => !groupOf(w)))
const has = (w: string) => props.modelValue.includes(w)

function toggle(w: string) {
  if (!props.editable) return
  emit('update:modelValue', has(w) ? props.modelValue.filter((x) => x !== w) : [...props.modelValue, w])
}

const adding = ref(false)
const word = ref('')
const input = ref<HTMLInputElement>()
async function startAdd() {
  adding.value = true
  await nextTick()
  input.value?.focus()
}
function addCustom() {
  const w = word.value.trim()
  if (w && !has(w)) emit('update:modelValue', [...props.modelValue, w])
  word.value = ''
  adding.value = false
}

// 估算每个词的框大小，让圈圈的笔画粗细不被拉伸变形
const chipSize = (w: string) => ({ w: w.length * 15 + 24, h: 34 })
const wordSize = (w: string) => ({ w: w.length * 13.5 + 8, h: 22 })
</script>

<template>
  <!-- 填写时：按类别分组的小布签 -->
  <div v-if="editable" class="groups">
    <div v-for="g in EMOTION_GROUPS" :key="g.key" class="group">
      <div class="g-name"><i :style="{ background: g.bg }" />{{ g.name }}</div>
      <div class="chips">
        <button
          v-for="w in g.words"
          :key="w"
          type="button"
          class="chip"
          :class="{ on: has(w) }"
          :style="has(w) ? { '--bg': g.bg } : undefined"
          :aria-pressed="has(w)"
          @click="toggle(w)"
        >
          {{ w }}
          <HandCircle v-if="has(w)" :seed="w" v-bind="chipSize(w)" animate />
        </button>
      </div>
    </div>
    <div class="group">
      <div class="g-name"><i :style="{ background: CUSTOM_GROUP_BG }" />我自己的词</div>
      <div class="chips">
        <button
          v-for="w in customs"
          :key="w"
          type="button"
          class="chip on"
          :style="{ '--bg': CUSTOM_GROUP_BG }"
          aria-pressed="true"
          @click="toggle(w)"
        >
          {{ w }}
          <HandCircle :seed="w" v-bind="chipSize(w)" animate />
        </button>
        <form v-if="adding" class="add-form" @submit.prevent="addCustom">
          <input ref="input" v-model="word" maxlength="8" placeholder="写一个词" enterkeyhint="done" @blur="addCustom" />
        </form>
        <button v-else type="button" class="chip add" @click="startAdd">＋ 其他</button>
      </div>
    </div>
  </div>

  <!-- 记录本页面上：所有词都印着，圈过的才画圈 -->
  <div v-else class="sheet">
    <template v-for="g in EMOTION_GROUPS" :key="g.key">
      <span v-for="w in g.words" :key="w" class="word" :class="{ on: has(w) }">
        {{ w }}
        <HandCircle v-if="has(w)" :seed="w" v-bind="wordSize(w)" />
      </span>
    </template>
    <span v-for="w in customs" :key="w" class="word on">
      {{ w }}
      <HandCircle :seed="w" v-bind="wordSize(w)" />
    </span>
  </div>
</template>

<style scoped>
.groups {
  display: grid;
  gap: 14px;
}
.g-name {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--ink-3);
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}
.g-name i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.7);
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 10px;
}
.chip {
  position: relative;
  height: 34px;
  padding: 0 12px;
  border: 0;
  border-radius: 999px;
  font-family: var(--font-hand);
  font-size: 15px;
  line-height: 34px;
  white-space: nowrap;
  color: var(--ink-2);
  background: rgb(255 255 255 / 0.55);
  box-shadow: inset 0 0 0 1px rgb(176 146 134 / 0.2);
  transition: background 0.2s, color 0.2s, transform 0.15s;
}
.chip.on {
  color: var(--ink);
  background: var(--grain), var(--bg);
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.6), 0 3px 8px -4px rgb(120 86 76 / 0.35);
}
.chip:active {
  transform: scale(0.95);
}
.chip.add {
  color: var(--ink-3);
  background: transparent;
  box-shadow: inset 0 0 0 1.3px rgb(176 146 134 / 0.4);
  border: 0;
  outline: 1.3px dashed transparent;
}
.add-form input {
  width: 112px;
  height: 34px;
  padding: 0 12px;
  border: 0;
  border-radius: 999px;
  outline: none;
  font-family: var(--font-hand);
  font-size: 16px;
  color: var(--ink);
  background: #fff;
  box-shadow: inset 0 0 0 1.3px var(--pen);
}

.sheet {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 9px;
}
.word {
  position: relative;
  padding: 1px 4px;
  font-size: 13.5px;
  line-height: 20px;
  color: var(--ink-3);
  white-space: nowrap;
}
.word.on {
  color: var(--ink);
  font-weight: 600;
}
</style>
