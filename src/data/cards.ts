// 22 张情绪重启卡：帮自己换个角度，找到更平衡的想法

import type { FigureId } from './figures'

export type CardGroup = 'view' | 'check' | 'trap' | 'care'

export interface RestartCard {
  id: string
  no: number
  group: CardGroup
  title: string
  /** 卡片正面的核心问题 */
  question: string
  /** 小提示：为什么这样问 */
  tip: string
  /** 可以这样想：一个示范 */
  example: string
  figure: FigureId
  bg: string
}

export const CARD_GROUPS: { key: CardGroup; name: string; desc: string }[] = [
  { key: 'view', name: '换个视角', desc: '站远一点、站到别处，看看同一件事' },
  { key: 'check', name: '检验想法', desc: '想法不等于事实，拿证据来看看' },
  { key: 'trap', name: '思维陷阱', desc: '认出那些常见的“想歪了”的方式' },
  { key: 'care', name: '照顾自己', desc: '先把自己照顾好，再慢慢想' },
]

export const CARDS: RestartCard[] = [
  // ---------- 换个视角 ----------
  {
    id: 'three-years',
    no: 1,
    group: 'view',
    title: '三年后',
    question: '三年后，我还会在意这件事吗？',
    tip: '把时间轴拉长一点。很多此刻觉得天大的事，放进三年里，都会慢慢变小。',
    example: '三年后，我大概已经想不起这次开会时谁说了什么。',
    figure: 'traveler',
    bg: 'var(--g-sky)',
  },
  {
    id: 'good-friend',
    no: 2,
    group: 'view',
    title: '好朋友',
    question: '如果好朋友遇到同样的事，我会对 TA 说什么？',
    tip: '我们总能温柔地安慰别人，却对自己格外苛刻。把这份温柔，也分一点给自己。',
    example: '如果是好朋友，我会说：“一次没讲好很正常，你已经准备得很认真了。”',
    figure: 'corgi',
    bg: 'var(--g-peach)',
  },
  {
    id: 'their-shoes',
    no: 3,
    group: 'view',
    title: '换位思考',
    question: '如果我是对方，那一刻 TA 可能在想什么、正经历着什么？',
    tip: '别人的反应，往往更多关于 TA 自己的状态，而不完全是关于我。',
    example: '领导可能只是太忙了，所以消息才发得那么简短。',
    figure: 'painter',
    bg: 'var(--g-lilac)',
  },
  {
    id: 'other-story',
    no: 4,
    group: 'view',
    title: '另一种解释',
    question: '除了我想的那样，还有没有别的可能？试着再想出两种。',
    tip: '第一个冒出来的解释，常常是最吓人的那一个，但不一定是最接近真相的那一个。',
    example: '朋友没回消息，也许在忙、在睡觉，或者看完忘了回。',
    figure: 'coffee',
    bg: 'var(--g-sand)',
  },

  // ---------- 检验想法 ----------
  {
    id: 'evidence',
    no: 5,
    group: 'check',
    title: '找证据',
    question: '支持这个想法的证据是什么？不支持它的证据又有哪些？',
    tip: '想法不等于事实。像侦探一样，只相信摆在眼前的证据，不相信脑补的画面。',
    example: '说我能力不行的证据只有这一次，可上个月我刚被客户夸过。',
    figure: 'photographer',
    bg: 'var(--g-mint)',
  },
  {
    id: 'three-outcomes',
    no: 6,
    group: 'check',
    title: '最坏·最好·最可能',
    question: '最坏会怎样？最好会怎样？最可能会怎样？',
    tip: '焦虑会把结果一下子放大成灾难。把三种可能都写下来，“最可能”往往没那么糟。',
    example: '最坏是被批评几句，最好是有新机会，最可能只是聊聊最近的工作。',
    figure: 'builder',
    bg: 'var(--g-butter)',
  },
  {
    id: 'even-if',
    no: 7,
    group: 'check',
    title: '就算真的发生',
    question: '如果最担心的事真的发生了，我可以怎么应对？谁能帮我？',
    tip: '我们常常低估了自己应对困难的能力。想一想，以前那些难关，我是怎么过来的。',
    example: '就算真的被批评，我也可以问清楚问题在哪，再一点点改。',
    figure: 'camper',
    bg: 'var(--g-rose)',
  },

  // ---------- 思维陷阱 ----------
  {
    id: 'mind-reading',
    no: 8,
    group: 'trap',
    title: '读心术',
    question: '我是不是在猜别人心里怎么想？我真的知道吗？',
    tip: '别人的心思就像一封没拆开的信。一句话、一个表情，可以有很多种意思。',
    example: '同事说“再想想”，也许只是觉得细节还能补充，并不是觉得我笨。',
    figure: 'postman',
    bg: 'var(--g-sky)',
  },
  {
    id: 'fortune-telling',
    no: 9,
    group: 'trap',
    title: '预言家',
    question: '我是不是在预言一个坏结局？可是，事情还没有发生。',
    tip: '未来还没写好。“可能会”不等于“一定会”，先别急着替明天下结论。',
    example: '我在担心明天会被开除，可现在我只知道“要聊一下”。',
    figure: 'penguin',
    bg: 'var(--g-lilac)',
  },
  {
    id: 'black-white',
    no: 10,
    group: 'trap',
    title: '非黑即白',
    question: '事情真的只有“全好”和“全糟”两种吗？中间还有什么？',
    tip: '生活里大多是灰色地带。六十分、七十分，也都是真实而珍贵的分数。',
    example: '这次汇报不算完美，但思路是清楚的，大概有七十分。',
    figure: 'cow',
    bg: 'var(--g-sand)',
  },
  {
    id: 'always-never',
    no: 11,
    group: 'trap',
    title: '以偏概全',
    question: '一次发生，就代表“总是”“永远”“每次都”吗？',
    tip: '把“总是”换成“这一次”，事情的分量马上就不一样了。学骑车摔一跤，不代表永远学不会。',
    example: '这次方案没通过，但上次的方案就被采纳了，并不是每次都这样。',
    figure: 'cyclist',
    bg: 'var(--g-mint)',
  },
  {
    id: 'mental-filter',
    no: 12,
    group: 'trap',
    title: '心理过滤',
    question: '我是不是只盯着不好的部分？有没有被我忽略的好事？',
    tip: '大脑天生更容易记住坏事。像小松鼠捡橡果一样，主动把今天的小好事捡回来。',
    example: '今天被说了一句，但也有人谢谢我帮忙，午饭也很好吃。',
    figure: 'squirrel',
    bg: 'var(--g-peach)',
  },
  {
    id: 'feeling-fact',
    no: 13,
    group: 'trap',
    title: '情绪推理',
    question: '我“感觉”是这样，就一定是这样吗？',
    tip: '情绪是真实的，但它不是证据。“我觉得自己很没用”，不等于“我真的没用”。',
    example: '我感到很丢脸，但这不代表大家都在笑话我。',
    figure: 'deer',
    bg: 'var(--g-rose)',
  },
  {
    id: 'should',
    no: 14,
    group: 'trap',
    title: '应该思维',
    question: '我是不是在用“应该”“必须”要求自己？换成“我希望”会怎样？',
    tip: '“应该”像一根绷得太紧的弦。花有自己的花期，人也有自己的节奏。',
    example: '不是“我应该什么都做好”，而是“我希望尽量做好，做不到也没关系”。',
    figure: 'gardener',
    bg: 'var(--g-sage)',
  },
  {
    id: 'labeling',
    no: 15,
    group: 'trap',
    title: '贴标签',
    question: '我是不是因为一件事，就给自己贴上了一个标签？',
    tip: '“我这次没做好”不等于“我是个失败的人”。一件事，只是一件事。',
    example: '我只是这次忘了回复，不代表我是个不靠谱的人。',
    figure: 'courier',
    bg: 'var(--g-butter)',
  },
  {
    id: 'not-all-me',
    no: 16,
    group: 'trap',
    title: '揽责任',
    question: '这件事真的全是我的责任吗？还有哪些因素在起作用？',
    tip: '试着画一个“责任饼图”：时间、环境、别人、运气……我只占其中一块。背包太重时，放下不属于自己的那部分。',
    example: '项目延期有需求变更、人手不够的原因，不全是因为我。',
    figure: 'hiker',
    bg: 'var(--g-sky)',
  },

  // ---------- 照顾自己 ----------
  {
    id: 'control',
    no: 17,
    group: 'care',
    title: '我能控制什么',
    question: '这件事里，哪些是我能控制的？哪些不是？',
    tip: '鱼咬不咬钩由不得我，但选位置、挂鱼饵、耐心等，是我能做的。把力气留给能控制的部分。',
    example: '我控制不了领导怎么想，但能先把要汇报的事情理一理。',
    figure: 'fisher',
    bg: 'var(--g-mint)',
  },
  {
    id: 'lesson',
    no: 18,
    group: 'care',
    title: '学到了什么',
    question: '从这件事里，我可以学到什么？',
    tip: '难受的经历，也在悄悄给我攒经验值。把它变成下一次的小提示。',
    example: '下次开会前，我可以先找一位同事把想法过一遍。',
    figure: 'reader',
    bg: 'var(--g-lilac)',
  },
  {
    id: 'tiny-step',
    no: 19,
    group: 'care',
    title: '小小一步',
    question: '现在，我能做的一件最小的事是什么？',
    tip: '不用一下子解决全部。迈出一小步，卡住的情绪就会松动一点。',
    example: '先把明天要聊的三个要点，写在便利贴上。',
    figure: 'duck',
    bg: 'var(--g-butter)',
  },
  {
    id: 'body-first',
    no: 20,
    group: 'care',
    title: '先照顾身体',
    question: '我现在是不是饿了、累了、困了，或者太久没休息？',
    tip: '身体没电的时候，想法也会变得灰暗。先喝口水、吃点东西、好好睡一觉，再来想。',
    example: '我已经连着熬了两晚，现在的悲观，有一半是因为太累了。',
    figure: 'bear',
    bg: 'var(--g-peach)',
  },
  {
    id: 'allow',
    no: 21,
    group: 'care',
    title: '允许难受',
    question: '允许自己难受一会儿。这份情绪，想告诉我什么？',
    tip: '情绪像天气，会来也会走。不用急着赶走它，先听听它想说什么。',
    example: '我难过，是因为我很在乎这份工作。这份在乎，本身没有错。',
    figure: 'guitarist',
    bg: 'var(--g-rose)',
  },
  {
    id: 'breathe',
    no: 22,
    group: 'care',
    title: '呼吸一下',
    question: '先停下来，慢慢呼吸几次：吸气 4 秒，停 2 秒，呼气 6 秒。',
    tip: '情绪太满的时候，先让身体安定下来，大脑才有空间换个角度。',
    example: '深呼吸几次之后，我发现这件事没有刚才想得那么急。',
    figure: 'cat',
    bg: 'var(--g-sage)',
  },
]

export function getCard(id: string) {
  return CARDS.find((c) => c.id === id)
}

export function groupName(key: CardGroup) {
  return CARD_GROUPS.find((g) => g.key === key)!.name
}

export function cardNo(card: RestartCard) {
  return `No.${String(card.no).padStart(2, '0')}`
}
