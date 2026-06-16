# ☁️ 云端同步完整指南

GameHub Pro 支持三种数据存储方式，实现云端同步和跨设备数据共享。

---

## 📊 方案对比

| 特性 | 本地存储 | Notion | Firebase |
|------|---------|--------|----------|
| 费用 | 免费 | 免费 | 免费额度 |
| 配置难度 | 无需配置 | 中等 | 简单 |
| 实时同步 | ❌ | ✅ | ✅ |
| 跨设备 | ❌ | ✅ | ✅ |
| 数据量限制 | 5-10MB | 无限制 | 1GB免费 |
| 离线使用 | ✅ | ❌ | ❌ |
| 推荐场景 | 单设备 | 团队协作 | 个人多设备 |

---

## 📝 方案一：Notion数据库同步

### 优点
- ✅ 可视化管理数据
- ✅ 支持团队协作
- ✅ 数据格式丰富
- ✅ 免费使用

### 配置步骤

#### 步骤1：创建Notion Integration

1. 访问 [Notion Integrations](https://www.notion.so/my-integrations)
2. 点击 **"+ New integration"**
3. 填写信息：
   - Name: `GameHub Sync`
   - Associated workspace: 选择你的工作区
4. 点击 **Submit**
5. 复制 **Internal Integration Token**（以 `secret_` 开头）

#### 步骤2：创建数据库

1. 在Notion中创建新页面
2. 添加数据库（选择表格视图）
3. 创建以下属性：

| 属性名 | 类型 | 说明 |
|--------|------|------|
| 标题 | Title | 游戏名称 |
| 图标 | Text | emoji图标 |
| 分类 | Select | 动作/角色扮演/策略/休闲/竞技/冒险 |
| 评分 | Number | 0-5 |
| 下载量 | Text | 如：100万+ |
| 描述 | Text | 游戏描述 |

#### 步骤3：连接Integration

1. 打开刚创建的数据库页面
2. 点击右上角 **"..."** → **"Add connections"**
3. 搜索并选择你创建的 `GameHub Sync`
4. 点击 **Confirm**

#### 步骤4：获取数据库ID

从数据库URL中获取ID：
```
https://www.notion.so/your-workspace/DATABASE_ID?v=...
                                    ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
                                    这就是数据库ID
```

#### 步骤5：在应用中配置

1. 进入 **个人中心** → **云端设置**
2. 选择 **Notion** 标签
3. 粘贴Token和数据库ID
4. 点击 **测试连接**
5. 保存设置

---

## 🔥 方案二：Firebase实时数据库

### 优点
- ✅ 配置简单
- ✅ 实时同步
- ✅ 免费额度充足
- ✅ 适合个人使用

### 配置步骤

#### 步骤1：创建Firebase项目

1. 访问 [Firebase控制台](https://console.firebase.google.com)
2. 点击 **"添加项目"**
3. 填写项目名称（如：`gamehub-sync`）
4. 可选择关闭Google Analytics
5. 点击 **创建项目**

#### 步骤2：创建实时数据库

1. 在项目中选择 **"Realtime Database"**
2. 点击 **"创建数据库"**
3. 选择数据库位置（建议选择亚洲区域）
4. 安全规则选择 **"以测试模式启动"**
5. 点击 **启用**

#### 步骤3：设置数据库规则

1. 点击 **"规则"** 标签
2. 修改规则为：

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

3. 点击 **发布**

> ⚠️ 注意：以上规则允许公开读写，仅用于测试。生产环境请添加认证。

#### 步骤4：获取配置信息

1. 点击项目设置（齿轮图标）
2. 选择 **"项目设置"**
3. 滚动到底部
4. 点击 **"Web应用"** 图标（</>）
5. 填写应用昵称
6. 复制Firebase配置JSON：

```json
{
  "apiKey": "AIzaSy...",
  "authDomain": "gamehub-sync.firebaseapp.com",
  "databaseURL": "https://gamehub-sync.firebaseio.com",
  "projectId": "gamehub-sync",
  "storageBucket": "gamehub-sync.appspot.com",
  "messagingSenderId": "123456789",
  "appId": "1:123456789:web:abcdef"
}
```

#### 步骤5：在应用中配置

1. 进入 **个人中心** → **云端设置**
2. 选择 **Firebase** 标签
3. 粘贴Firebase配置JSON
4. 点击 **测试连接**
5. 保存设置

---

## 🚀 使用方法

### 手动同步

1. **上传到云端**：个人中心 → 同步到云端 → 上传
2. **从云端下载**：个人中心 → 从云端获取 → 下载

### 自动同步

1. 进入 **个人中心** → **云端设置**
2. 勾选 **"自动同步"**
3. 保存设置
4. 数据变更时将自动同步

---

## 💡 推荐方案

### 个人用户 → Firebase
- 配置简单，5分钟搞定
- 免费额度充足
- 实时同步体验好

### 团队协作 → Notion
- 可视化管理
- 支持多人编辑
- 数据格式丰富

### 离线使用 → 本地存储
- 无需网络
- 响应速度快
- 数据隐私性好

---

## ❓ 常见问题

### Q: Notion同步失败怎么办？
A: 检查以下几点：
1. Token是否正确
2. 数据库ID是否正确
3. Integration是否已连接到数据库
4. 属性名称是否匹配（区分中英文）

### Q: Firebase同步失败？
A: 检查以下几点：
1. 数据库URL是否正确
2. 安全规则是否设置为公开
3. 网络是否正常

### Q: 如何切换同步方式？
A: 在云端设置中选择不同的提供商，数据会自动迁移。

### Q: 数据会丢失吗？
A: 
- 本地数据：清除浏览器数据会丢失
- 云端数据：永久保存在云端
- 建议：定期导出CSV备份

---

## 🔐 安全建议

### Firebase安全规则（推荐）

```json
{
  "rules": {
    "games": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

需要配合Firebase Authentication使用。

### Notion安全

- Token具有完全访问权限，请妥善保管
- 不要将Token提交到公开代码仓库
- 定期在Notion中重新生成Token

---

## 📱 打包APK后使用

打包成APK后，云端同步功能仍然可用：

1. 打开应用
2. 进入个人中心
3. 配置云端同步
4. 开始使用

**注意**：由于CORS限制，Notion API在APK中可能需要通过代理服务器访问。建议使用Firebase作为主要同步方案。
