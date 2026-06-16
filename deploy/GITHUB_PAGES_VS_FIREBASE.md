# GitHub Pages + 静态JSON vs Firebase 详细对比

## 流量成本对比（1000用户）

| 方案 | 1000用户/天 | 月成本 |
|------|-------------|--------|
| Firebase Realtime DB | ~5000MB (超支) | **$50-100/月** |
| GitHub Pages + CDN | ~50MB | **$0 (免费)** |

---

## 方案详细对比

### 当前方案：Firebase Realtime Database

**优点：**
- ✅ 实时更新（虽然我们不需要）
- ✅ 配置简单
- ✅ 支持读写（虽然我们只需要读）

**缺点：**
- ❌ **流量太贵** - 免费360MB/天，1000人用直接爆炸
- ❌ 下载速度一般（取决于区域）
- ❌ 每次同步全量下载

---

### 推荐方案：GitHub Pages + 静态JSON（完全免费）

**架构：**

```
Firebase (仅配置)
├── /config.json (版本号、管理员密码) ← 小文件 (~100B)
└── /data_version.json (数据版本号) ← 小文件 (~50B)

GitHub Pages / CDN (游戏数据)
└── games.json.gz (压缩后的游戏数据) ← ~5MB
```

**工作流程：**

1. **APP启动时：**
   - 从Firebase读取 `/config.json` (检查更新、密码)
   - 从Firebase读取 `/data_version.json`
   - 对比本地版本，有更新才下载 `games.json`

2. **同步时：**
   - 检查数据版本
   - 没变 → 提示"已是最新"
   - 变了 → 从GitHub下载新数据

**数据更新流程（管理员）：**
1. Notion → 导出CSV
2. 用上传工具转换为JSON
3. 压缩成 `games.json.gz`
4. 上传到GitHub Releases
5. 更新Firebase的 `/data_version.json`

---

## 性能对比

| 指标 | Firebase | GitHub Pages + CDN |
|------|----------|---------------------|
| 下载速度 | 一般 | **快2-5倍** (全球CDN) |
| 首次加载 | ~5-10秒 | **~2-3秒** |
| 压缩支持 | 无 | **gzip 70-80%** |
| 缓存策略 | ETag | **ETag + Cache-Control** |

---

## 1000用户场景流量估算

### Firebase方案（当前）
```
每次同步：5MB (games.json)
1000用户 × 5MB = 5000MB/天
免费额度：360MB/天
超出：4640MB/天 → $$$
```

### GitHub Pages方案
```
每天检查版本：1000用户 × (100B + 50B) = 150KB
假设10%用户需要更新：100 × 5MB = 500MB
总计：~500MB/天 ✅ (完全免费)
```

**GitHub Pages免费额度：**
- 带宽：100GB/月
- 构建次数：10次/小时
- 完全够用！

---

## 实施步骤

### 第一步：准备数据
1. Notion导出CSV
2. 用上传工具转成JSON
3. 压缩成 `games.json.gz`

### 第二步：上传到GitHub
1. 创建GitHub Releases
2. 上传 `games.json.gz`
3. 获取下载链接

### 第三步：配置Firebase
在 `/config.json` 中添加：
```json
{
  "latest_version": "2.0.0",
  "update_url": "https://...",
  "admin_password": "520hd123",
  "games_data_url": "https://github.com/.../games.json.gz",
  "games_data_version": "2024032401"
}
```

### 第四步：修改APP代码
- 同步逻辑改为从GitHub下载
- 用 data_version 检查是否需要更新

---

## 总结

| 方面 | Firebase | GitHub Pages |
|------|----------|---------------|
| 1000用户成本 | $50-100/月 | **$0** |
| 加载速度 | 一般 | **快2-5倍** |
| 实现难度 | 简单 | **中等** |
| 维护成本 | 低 | **低** |

**强烈建议切换到GitHub Pages方案！**
