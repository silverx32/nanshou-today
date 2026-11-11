// 全局的小提示（toast）和确认框，由 components/Overlays.vue 负责显示

import { reactive } from 'vue'
import { Capacitor } from '@capacitor/core'

// ---------- 安卓返回键：先关最上层的弹层，再退页面 ----------
const backHandlers: (() => void)[] = []

/** 注册一个返回键处理，返回取消注册的函数 */
export function onBack(handler: () => void) {
  backHandlers.push(handler)
  return () => {
    const i = backHandlers.lastIndexOf(handler)
    if (i >= 0) backHandlers.splice(i, 1)
  }
}

/** 有弹层就交给它处理，返回 true */
export function handleBack() {
  const top = backHandlers.at(-1)
  top?.()
  return !!top
}

export const toastState = reactive({ text: '', show: false })
let toastTimer: number | undefined

export function toast(text: string) {
  toastState.text = text
  toastState.show = true
  clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => (toastState.show = false), 2200)
}

export interface ConfirmOptions {
  title: string
  message?: string
  ok?: string
  cancel?: string
  danger?: boolean
  figure?: string
}

export const confirmState = reactive<{ open: boolean; opts: ConfirmOptions; resolve?: (v: boolean) => void }>({
  open: false,
  opts: { title: '' },
})
let offConfirmBack: (() => void) | undefined

export function confirmDialog(opts: ConfirmOptions) {
  return new Promise<boolean>((resolve) => {
    confirmState.opts = opts
    confirmState.resolve = resolve
    confirmState.open = true
    offConfirmBack = onBack(() => settleConfirm(false))
  })
}

export function settleConfirm(ok: boolean) {
  offConfirmBack?.()
  offConfirmBack = undefined
  confirmState.open = false
  confirmState.resolve?.(ok)
  confirmState.resolve = undefined
}

/** 把备份文件交给用户：App 里弹出系统分享面板，浏览器里直接下载 */
export async function shareFile(filename: string, text: string) {
  if (Capacitor.isNativePlatform()) {
    const { Filesystem, Directory, Encoding } = await import('@capacitor/filesystem')
    const { Share } = await import('@capacitor/share')
    const { uri } = await Filesystem.writeFile({ path: filename, data: text, directory: Directory.Cache, encoding: Encoding.UTF8 })
    await Share.share({ title: filename, url: uri, dialogTitle: '保存或发送备份文件' })
    return
  }
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
