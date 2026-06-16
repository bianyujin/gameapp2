# Firebase 配置说明

## 1. 在 Firebase Realtime Database 中添加配置节点

在你的 Firebase Realtime Database 根目录下创建一个 `config` 节点，内容如下：

```json
{
  "latest_version": "2.0.0",
  "update_url": "https://your-download-url.com/app.apk",
  "admin_password": "520hd123"
}
```

## 2. 字段说明

- **latest_version**: 最新版本号（用于强制更新检查）
- **update_url**: 新版本下载地址
- **admin_password**: 管理员密码（云端验证）

## 3. 如何设置

### 方法一：通过 Firebase 控制台
1. 访问 [Firebase 控制台](https://console.firebase.google.com/)
2. 选择你的项目
3. 进入 "Realtime Database"
4. 点击 "+" 添加新节点
5. 节点名称填：`config`
6. 值填上面的 JSON 内容

### 方法二：通过上传工具
你也可以创建一个 JSON 文件，然后通过 API 直接 PUT 到 Firebase：

```
PUT https://galgame-a5758-default-rtdb.asia-southeast1.firebasedatabase.app/config.json
Body: (上面的 JSON)
```

## 4. 发布新版本的步骤

当你需要发布新版本时：

1. 修改 `index.html` 中的版本号（第143行）
2. 修改 `js/cloud-sync.js` 中的 `appVersion`（第13行）
3. 在 Firebase 的 `config` 节点中更新 `latest_version`
4. 更新 `update_url` 为新的下载地址
5. 重新打包 APK

用户打开旧版本 APP 时，会自动检测到新版本并强制更新！

## 5. 安全说明

- 管理员密码现在从云端读取，不再硬编码在 APP 中
- 即使 APK 被解包，也看不到管理员密码
- 私有数据仍然在 Firebase 中，但只有登录管理员才能看到
- Firebase 数据库规则建议设置为只读（除了 config 节点）
