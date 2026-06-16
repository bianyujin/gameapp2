# Git LFS 配置指南

## 解决GitHub单文件25MB限制问题

### 方法1：Git LFS（推荐）

Git LFS（Large File Storage）是GitHub官方的大文件存储解决方案，免费版支持1GB存储。

#### 步骤1：安装Git LFS

**Windows:**
```bash
# 下载并安装Git LFS
# https://git-lfs.github.com/

# 或使用Chocolatey
choco install git-lfs

# 或使用Scoop
scoop install git-lfs
```

**Mac:**
```bash
brew install git-lfs
```

**Linux:**
```bash
sudo apt-get install git-lfs
# 或
sudo yum install git-lfs
```

#### 步骤2：初始化Git LFS

```bash
cd d:\trae_project\app\github-upload
git lfs install
```

#### 步骤3：配置LFS跟踪

```bash
# 跟踪所有JSON文件
git lfs track "*.json"

# 或只跟踪games.json
git lfs track "games.json"
```

#### 步骤4：提交并推送

```bash
git add .gitattributes
git add games.json
git commit -m "使用Git LFS存储大文件"
git push origin main
```

#### 步骤5：验证

```bash
# 查看LFS文件状态
git lfs ls-files

# 查看LFS配置
cat .gitattributes
```

---

### 方法2：压缩JSON

如果文件不是特别大，可以压缩后上传：

#### 使用gzip压缩

```bash
# 压缩
gzip -k games.json

# 这会生成 games.json.gz 文件
```

#### 修改APP代码支持gzip

需要在cloud-sync.js中添加解压功能。

---

### 方法3：分割文件

将大文件分割成多个小文件：

```bash
# 分割成20MB的小文件
split -b 20M games.json games_part_

# 会生成:
# games_part_aa
# games_part_ab
# games_part_ac
# ...
```

---

## 推荐方案

**使用Git LFS**，因为：
- ✅ GitHub官方支持
- ✅ 免费1GB存储
- ✅ 对用户透明
- ✅ 不需要修改APP代码
- ✅ 自动处理大文件

---

## 注意事项

1. **免费额度**: GitHub免费版提供1GB LFS存储和1GB/月带宽
2. **文件大小**: 单个LFS文件最大2GB
3. **克隆**: 克隆仓库时会自动下载LFS文件
4. **历史**: LFS文件的历史记录会被保留

---

## 常见问题

### Q: 如何查看LFS使用情况？
A: 在GitHub仓库页面，点击"Settings" → "Billing" → "Git LFS"

### Q: 超过1GB怎么办？
A: 可以购买额外存储，或使用其他方案（压缩、分割）

### Q: 其他人克隆仓库需要安装LFS吗？
A: 是的，需要先安装Git LFS才能正确克隆LFS文件

---

## 完整示例

```bash
# 1. 安装Git LFS
choco install git-lfs

# 2. 进入项目目录
cd d:\trae_project\app\github-upload

# 3. 初始化
git lfs install

# 4. 配置跟踪
git lfs track "*.json"

# 5. 添加配置文件
git add .gitattributes

# 6. 添加大文件
git add games.json

# 7. 提交
git commit -m "使用Git LFS存储games.json"

# 8. 推送
git push origin main
```

完成后，games.json会被自动上传到Git LFS，不再受25MB限制！
