# 🔥 Firebase配置完整教程

## 第一步：创建Firebase项目

1. 访问 https://console.firebase.google.com
2. 点击 **"添加项目"** 或 **"创建项目"**
3. 填写项目名称（如：`gamehub-galgame`）
4. 可选择关闭Google Analytics
5. 点击 **"创建项目"**

---

## 第二步：创建实时数据库

1. 在项目页面，点击左侧 **"Realtime Database"**
2. 点击 **"创建数据库"**
3. 选择位置：**asia-east1 (台湾)** 或 **asia-northeast1 (东京)**
4. 安全规则选择：**"以测试模式启动"**
5. 点击 **"启用"**

---

## 第三步：设置数据库规则

1. 点击 **"规则"** 标签
2. 将规则改为：

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

3. 点击 **"发布"**

> ⚠️ 这是公开读写规则，仅用于测试。生产环境请设置认证。

---

## 第四步：获取配置信息

1. 点击左上角 **齿轮图标** → **"项目设置"**
2. 滚动到页面底部
3. 点击 **"</>"** 图标（Web应用）
4. 填写应用昵称（如：`GameHub Web`）
5. **不要**勾选Firebase Hosting
6. 点击 **"注册应用"**
7. 复制 **firebaseConfig** 内容：

```javascript
{
  apiKey: "AIzaSy...",
  authDomain: "gamehub-xxx.firebaseapp.com",
  databaseURL: "https://gamehub-xxx.firebaseio.com",
  projectId: "gamehub-xxx",
  storageBucket: "gamehub-xxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxx"
}
```

8. 点击 **"继续访问控制台"**

---

## 第五步：从Notion导出数据

### 方法一：手动导出

1. 打开您的Notion表格
2. 点击右上角 **"..."** → **"导出"**
3. 选择 **CSV** 格式
4. 下载文件

### 方法二：使用我们的转换工具

访问：`http://localhost:3000/notion-to-firebase.html`

---

## 第六步：导入数据到Firebase

### 方法一：通过控制台（推荐新手）

1. 打开Firebase控制台 → Realtime Database
2. 点击 **"..."** → **"导入JSON"**
3. 选择转换后的JSON文件
4. 点击 **"导入"**

### 方法二：通过应用导入

1. 打开应用 → 个人中心 → 云端设置
2. 选择 **Firebase** 标签
3. 粘贴配置JSON
4. 保存设置
5. 点击 **"同步到云端"**

---

## 第七步：在应用中配置

1. 打开应用 → **个人中心**
2. 向下滚动 → **云端同步** → **配置**
3. 选择 **🔥 Firebase** 标签
4. 粘贴Firebase配置JSON
5. 点击 **保存设置**
6. 点击 **"从云端获取"** 测试

---

## 📝 后续如何更新数据？

### 方式一：在应用中编辑（推荐）

1. 登录管理员（个人中心 → 管理员 → 进入）
2. 点击右下角 **+** 添加游戏
3. 在数据表格中编辑/删除
4. 点击 **"同步到云端"** 保存

### 方式二：通过Firebase控制台

1. 打开Firebase控制台 → Realtime Database
2. 直接编辑JSON数据
3. 应用中点击 **"从云端获取"** 更新

### 方式三：Notion → Firebase（批量更新）

1. 在Notion中编辑数据
2. 导出CSV
3. 使用转换工具转为JSON
4. 导入到Firebase

---

## 💰 费用说明

| 项目 | 免费额度 |
|------|----------|
| 存储 | 1GB |
| 下载流量 | 10GB/月 |
| 并发连接 | 100个 |
| 数据库操作 | 50万次/天 |

**对于个人应用，完全免费！**

---

## ❓ 常见问题

### Q: Firebase会被墙吗？
A: Firebase在国内访问相对稳定，使用亚洲节点速度较快。

### Q: 数据安全吗？
A: 数据存储在Google服务器，建议不要存储敏感信息。

### Q: 可以多人协作吗？
A: 可以！多人可以同时访问同一个Firebase数据库。

### Q: 和Notion相比有什么区别？
A: 
- **Notion**：可视化表格，适合管理
- **Firebase**：JSON格式，适合应用读取
- **建议**：用应用内的管理功能，或用Notion管理后批量导入
