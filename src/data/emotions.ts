// 「当时的感受是什么？」里可以圈的情绪词，按类别分组方便查找

export interface EmotionGroup {
  key: string
  name: string
  bg: string
  words: string[]
}

export const EMOTION_GROUPS: EmotionGroup[] = [
  { key: 'fear', name: '担心害怕', bg: 'var(--g-butter)', words: ['焦虑', '恐慌', '紧张', '恐惧', '不安', '慌乱', '担心'] },
  {
    key: 'sad',
    name: '难过低落',
    bg: 'var(--g-sky)',
    words: ['悲伤', '抑郁', '沮丧', '消沉', '绝望', '哀伤', '低落', '委屈', '无助', '空虚'],
  },
  { key: 'anger', name: '生气烦躁', bg: 'var(--g-rose)', words: ['暴怒', '怨恨', '气愤', '易怒', '愤懑', '憎恨', '烦躁'] },
  {
    key: 'shame',
    name: '自责羞愧',
    bg: 'var(--g-lilac)',
    words: ['愧疚', '自责', '懊悔', '羞耻', '尴尬', '难堪', '罪恶感', '无价值感', '自卑', '自我怀疑'],
  },
  {
    key: 'alone',
    name: '孤单疏离',
    bg: 'var(--g-sage)',
    words: ['孤独', '被排斥感', '被拒绝感', '格格不入', '失望', '嫉妒'],
  },
]

export const CUSTOM_GROUP_BG = 'var(--g-peach)'

export function groupOf(word: string) {
  return EMOTION_GROUPS.find((g) => g.words.includes(word))
}
