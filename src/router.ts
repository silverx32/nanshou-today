import { createRouter, createWebHashHistory } from 'vue-router'
import CardsView from './views/CardsView.vue'
import DoneView from './views/DoneView.vue'
import EditorView from './views/EditorView.vue'
import EntryView from './views/EntryView.vue'
import HomeView from './views/HomeView.vue'
import MeView from './views/MeView.vue'

declare module 'vue-router' {
  interface RouteMeta {
    /** 显示底部导航 */
    tab?: boolean
  }
}

export const router = createRouter({
  // hash 路由：打包进 App、或放在任意静态服务器上都不需要额外配置
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: HomeView, meta: { tab: true } },
    { path: '/cards', component: CardsView, meta: { tab: true } },
    { path: '/me', component: MeView, meta: { tab: true } },
    { path: '/write/:id?', component: EditorView },
    { path: '/entry/:id', component: EntryView },
    { path: '/done/:id', component: DoneView },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  // 等页面切换动画结束再滚动
  scrollBehavior: (_to, _from, saved) => new Promise((resolve) => setTimeout(() => resolve(saved ?? { top: 0 }), 210)),
})
