# GameHub - 游戏整合平台

一款现代化的安卓APK游戏整合平台应用，无需手动配置签名即可快速打包使用。

## 🌟 功能特点

### 核心功能
- **游戏信息展示**：汇集各类游戏详细介绍、评分、下载链接和攻略
- **分类浏览**：按游戏类型分类查找，包括动作、角色扮演、策略、休闲等
- **搜索功能**：快速搜索感兴趣的游戏
- **收藏管理**：收藏喜爱的游戏，方便下次查看
- **实时更新**：获取最新游戏资讯和更新信息

### 技术特性
- **现代化UI设计**：深色主题，视觉效果美观
- **响应式布局**：适配各种屏幕尺寸
- **高性能**：启动快速，内存占用合理
- **PWA支持**：可添加到主屏幕，离线可用
- **内置签名**：无需手动配置签名文件即可打包APK

## 🚀 快速开始

### 环境要求
- Node.js 16+
- npm 或 yarn
- Java JDK 8+
- Android Studio (用于APK构建)

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev
```

然后在浏览器中打开 `http://localhost:3000`

### 构建APK

#### 方法一：一键脚本（推荐）

```bash
# 1. 初始化项目（包含生成签名密钥）
npm run apk:init

# 2. 同步代码到Android项目
npm run apk:sync

# 3. 构建调试版APK
npm run apk:build

# 4. 构建发布版APK
npm run apk:release
```

#### 方法二：手动构建

```bash
# 1. 安装依赖
npm install

# 2. 初始化Capacitor
npx cap init "GameHub" "com.gamehub.app" --web-dir=.

# 3. 添加Android平台
npx cap add android

# 4. 生成签名密钥（如需要）
keytool -genkey -v -keystore android/app/release.keystore -alias gamehub -keyalg RSA -keysize 2048 -validity 10000

# 5. 同步代码
npx cap sync

# 6. 构建APK
cd android
./gradlew assembleDebug
# 或发布版
./gradlew assembleRelease
```

### APK输出位置

- 调试版：`android/app/build/outputs/apk/debug/app-debug.apk`
- 发布版：`android/app/build/outputs/apk/release/app-release.apk`

## 📁 项目结构

```
app/
├── index.html              # 主HTML文件
├── manifest.json           # PWA配置文件
├── package.json            # 项目配置
├── capacitor.config.json   # Capacitor配置
├── css/
│   └── styles.css         # 样式文件
├── js/
│   └── app.js             # 应用逻辑
├── scripts/
│   ├── build.js           # 构建脚本
│   └── init-capacitor.js  # 初始化脚本
├── icons/                 # 应用图标（待添加）
└── android/               # Android项目（生成后）
```

## 🎨 自定义配置

### 修改应用信息

编辑 `capacitor.config.json`：

```json
{
  "appId": "com.yourcompany.yourapp",
  "appName": "你的应用名称"
}
```

### 修改签名配置

编辑 `capacitor.config.json` 中的 `android.buildOptions`：

```json
{
  "android": {
    "buildOptions": {
      "keystorePath": "./path/to/your.keystore",
      "keystoreAlias": "your-alias",
      "keystorePassword": "your-password",
      "keystoreAliasPassword": "your-alias-password"
    }
  }
}
```

### 添加应用图标

在 `icons/` 目录下添加以下尺寸的PNG图标：
- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

## 🔧 技术栈

- **前端**：HTML5, CSS3, JavaScript (ES6+)
- **移动框架**：Capacitor 6.0
- **设计**：现代深色主题UI
- **兼容性**：Android 7.0+

## 📱 兼容性

- 支持 Android 7.0 (API 24) 及以上版本
- 适配各种屏幕尺寸和分辨率
- 支持横竖屏切换

## 🔒 安全特性

- 内置签名密钥管理
- 本地数据存储加密
- HTTPS网络请求
- 用户隐私保护

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

**注意**：首次构建APK需要安装Android Studio和相关SDK。详细的Android开发环境配置请参考[Android官方文档](https://developer.android.com/studio)。
