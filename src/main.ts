import { Capacitor } from '@capacitor/core'
import { createApp } from 'vue'
import 'lxgw-wenkai-webfont/lxgwwenkai-regular.css'
import './styles/base.css'
import App from './App.vue'
import { router } from './router'
import { handleBack } from './ui'

createApp(App).use(router).mount('#app')

if (Capacitor.isNativePlatform()) {
  // 安卓返回键：先关弹层；在首页就退到后台；其他标签页回首页；其余页面返回上一页
  import('@capacitor/app').then(({ App: NativeApp }) =>
    NativeApp.addListener('backButton', ({ canGoBack }) => {
      if (handleBack()) return
      const route = router.currentRoute.value
      if (route.path === '/') NativeApp.minimizeApp()
      else if (route.meta.tab || !canGoBack) router.replace('/')
      else router.back()
    }),
  )
}

// 在浏览器里用时注册 Service Worker，断网也能打开；打包成 App 时不需要
if (!Capacitor.isNativePlatform() && import.meta.env.PROD) {
  import('virtual:pwa-register').then(({ registerSW }) => registerSW({ immediate: true }))
}
