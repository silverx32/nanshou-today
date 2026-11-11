# 我今天又难受了

一本温柔的 CBT 认知重构记录本。结构照着纸质记录本来：

1. **发生了什么事？**（时间 | 地点 | 人物 | 事件）
2. **是什么想法引起了你的情绪？**
3. **当时的感受是什么？** —— 圈出情绪（手绘圈圈），按强度打分 0~10
4. **还可以怎么看待这件事？** —— 抽 **情绪重启卡** 帮自己找到更平衡的想法
5. **情绪有平复吗？** —— 第二次打分，看看前后变化

另外还有：22 张情绪重启卡（每张配一个微缩小人）、草稿自动保存、「先存着晚点再整理」、回顾统计、备份导入导出、安卓返回键处理，以及在记录里出现危险信号时温和地给出心理援助热线。

所有记录只保存在手机本地（localStorage），不联网、不上传。

| 记录本 | 圈出情绪、打分 | 抽一张重启卡 | 记录本里的一页 |
| --- | --- | --- | --- |
| ![](docs/screenshots/11-home.jpg) | ![](docs/screenshots/04-step3.jpg) | ![](docs/screenshots/06-draw.jpg) | ![](docs/screenshots/10-entry.jpg) |

| 22 张情绪重启卡 | 我的（回顾与备份） | 安卓真机画面 |
| --- | --- | --- |
| ![](docs/screenshots/13-cards.jpg) | ![](docs/screenshots/15-me.jpg) | ![](docs/screenshots/android-cards.jpg) |

## 技术栈

- Vue 3 + TypeScript + Vite
- Capacitor 8 打包安卓 App
- vite-plugin-pwa：在浏览器里也能「添加到主屏幕」离线使用（iPhone 可以这样用）
- 手写字体：霞鹜文楷（LXGW WenKai，OFL 开源授权）

## 常用命令

```bash
npm install          # 第一次先装依赖
npm run dev          # 开发预览，手机和电脑连同一个 Wi-Fi，用终端里显示的 Network 地址打开
npm run build        # 类型检查 + 打包网页到 dist/
npm run cap:sync     # 打包网页并同步到安卓工程
npm run android:open # 用 Android Studio 打开安卓工程
```

### 打安卓安装包（APK）

```bash
npm run cap:sync
cd android
# 用 Android Studio 自带的 JDK 21（系统默认的 JDK 24 太新）
JAVA_HOME="C:/Program Files/Android/Android Studio/jbr" ./gradlew assembleDebug
```

生成的安装包在 `android/app/build/outputs/apk/debug/app-debug.apk`，发到手机上安装即可（需要允许「安装未知来源应用」）。

> 项目路径里有中文，所以 `android/gradle.properties` 里加了 `android.overridePathCheck=true`。

正式上架前需要：换成自己的 `appId`（`capacitor.config.ts`，当前是 `com.wjtynsl.app`）、生成签名证书并打 release 包。

## 目录

```
src/
  data/cards.ts        22 张情绪重启卡的文案（标题、问题、小提示、示范、配的小人、颜色）
  data/emotions.ts     可以圈的情绪词，按类别分组
  data/figures.ts      32 个微缩小人的名字
  store.ts             记录、草稿、备份（都在 localStorage）
  views/               首页、写一页（五步）、完成页、记录详情、重启卡、我的
  components/          小人、手绘圈圈、横线书写区、打分条、卡片、底部面板……
  styles/base.css      布艺风格：渐变色、布纹、毛毡颗粒、缝线
public/figures/        切好的小人素材（webp）
scripts/
  slice_figures.py     把「粉彩萌系迷你职业与动物 figurines.png」切成 32 个小人
  make_icons.py        生成 App 图标（网页 + 安卓启动图标）
```

改卡片文案只需要编辑 `src/data/cards.ts`；换小人素材后重新运行：

```bash
python -I scripts/slice_figures.py "粉彩萌系迷你职业与动物 figurines.png" public/figures
python -I scripts/make_icons.py .
```

## 说明

这是自助记录工具，不能代替专业的心理咨询或治疗。
