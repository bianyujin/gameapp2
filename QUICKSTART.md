# 快速启动指南

## 5分钟快速上手

### 前置条件
确保已安装：
- Node.js 16+
- npm

### 第一步：运行Web版本（立即体验）

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev
```

然后在浏览器打开 `http://localhost:3000` 即可查看应用！

### 第二步：打包成APK（需要Android环境）

#### 如果你有Android Studio：

```bash
# 1. 初始化Capacitor并生成签名密钥
npm run apk:init

# 2. 同步代码
npm run apk:sync

# 3. 构建APK
npm run apk:build
```

APK文件位置：`android/app/build/outputs/apk/debug/app-debug.apk`

#### 如果你没有Android环境：

可以使用在线打包服务，如：
- [PhoneGap Build](https://build.phonegap.com/)
- [Cordova Online Builder](https://cordova.apache.org/)

或者使用PWA方式：
1. 在Chrome浏览器中打开应用
2. 点击"添加到主屏幕"
3. 即可像原生应用一样使用！

## 项目文件说明

| 文件 | 说明 |
|------|------|
| index.html | 主页面 |
| css/styles.css | 样式文件 |
| js/app.js | 应用逻辑 |
| manifest.json | PWA配置 |
| capacitor.config.json | APK打包配置 |
| package.json | 项目依赖配置 |
| scripts/ | 自动化脚本 |
| README.md | 完整文档 |

## 常见问题

### Q: 如何修改游戏数据？
A: 编辑 `js/app.js` 中的 `loadSampleData()` 函数

### Q: 如何更换应用图标？
A: 在 `icons/` 目录下放置对应尺寸的PNG图标

### Q: APK签名密码是什么？
A: 默认密码是 `gamehub123`，可在 `capacitor.config.json` 中修改

## 技术支持

详细文档请查看 `README.md`
