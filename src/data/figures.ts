// 32 个微缩小人（素材切自「粉彩萌系迷你职业与动物 figurines.png」，见 scripts/slice_figures.py）

export const FIGURES = {
  hiker: '登山的小人',
  gardener: '浇花的小人',
  painter: '画画的小人',
  photographer: '拍照的小人',
  baker: '做蛋糕的小人',
  reader: '看书的小人',
  coder: '敲电脑的小人',
  traveler: '去旅行的小人',
  builder: '看图纸的小人',
  courier: '送快递的小人',
  postman: '送信的小人',
  cyclist: '骑单车的小人',
  coffee: '喝咖啡的小人',
  fisher: '钓鱼的小人',
  camper: '烤棉花糖的小人',
  guitarist: '弹吉他的小人',
  cat: '三花猫',
  corgi: '小柯基',
  rabbit: '小兔子',
  fox: '小狐狸',
  deer: '小鹿',
  bear: '小熊',
  squirrel: '小松鼠',
  hedgehog: '小刺猬',
  duck: '小鸭子',
  goose: '大白鹅',
  pig: '小猪',
  cow: '小奶牛',
  sheep: '小绵羊',
  pony: '小马',
  raccoon: '小浣熊',
  penguin: '小企鹅',
} as const

export type FigureId = keyof typeof FIGURES

export const FIGURE_IDS = Object.keys(FIGURES) as FigureId[]

export function figureUrl(id: string) {
  return `${import.meta.env.BASE_URL}figures/${id}.webp`
}

export function randomFigure(): FigureId {
  return FIGURE_IDS[Math.floor(Math.random() * FIGURE_IDS.length)]
}
