import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.wjtynsl.app',
  appName: '我今天又难受了',
  webDir: 'dist',
  plugins: {
    SystemBars: {
      // 注入 --safe-area-inset-* 变量，页面自己留出状态栏/手势条的位置
      insetsHandling: 'css',
      initialViewportFitValueHint: 'cover',
      // 浅色背景，状态栏用深色图标
      style: 'LIGHT',
    },
  },
}

export default config
