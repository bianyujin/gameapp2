const fs = require('fs');
const path = require('path');

console.log('📦 开始构建 GameHub 应用...\n');

const distDir = path.join(__dirname, '../dist');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const filesToCopy = [
  'index.html',
  'manifest.json',
  'css/styles.css',
  'js/app.js'
];

console.log('📋 复制文件:');
filesToCopy.forEach(file => {
  const srcPath = path.join(__dirname, '../', file);
  const destPath = path.join(distDir, file);
  
  const destDirPath = path.dirname(destPath);
  if (!fs.existsSync(destDirPath)) {
    fs.mkdirSync(destDirPath, { recursive: true });
  }
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ⚠️  跳过: ${file} (文件不存在)`);
  }
});

console.log('\n✅ 构建完成！输出目录: dist/');
console.log('\n📱 下一步:');
console.log('   1. 安装依赖: npm install');
console.log('   2. 初始化 Capacitor: npm run apk:init');
console.log('   3. 同步代码: npm run apk:sync');
console.log('   4. 构建 APK: npm run apk:build');
