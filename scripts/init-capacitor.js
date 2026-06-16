const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 初始化 Capacitor Android 项目...\n');

try {
  if (!fs.existsSync('node_modules')) {
    console.log('📦 安装依赖...');
    execSync('npm install', { stdio: 'inherit' });
  }

  console.log('\n🔧 初始化 Capacitor...');
  if (!fs.existsSync('capacitor.config.json')) {
    execSync('npx cap init "GameHub" "com.gamehub.app" --web-dir=. --npm-client=npm', { stdio: 'inherit' });
  }

  console.log('\n📱 添加 Android 平台...');
  if (!fs.existsSync('android')) {
    execSync('npx cap add android', { stdio: 'inherit' });
  }

  console.log('\n🔑 生成签名密钥...');
  const keystorePath = path.join(__dirname, '../android/app/release.keystore');
  if (!fs.existsSync(keystorePath)) {
    const keytoolCmd = [
      'keytool',
      '-genkey',
      '-v',
      '-keystore', 'android/app/release.keystore',
      '-alias', 'gamehub',
      '-keyalg', 'RSA',
      '-keysize', '2048',
      '-validity', '10000',
      '-storepass', 'gamehub123',
      '-keypass', 'gamehub123',
      '-dname', 'CN=GameHub, OU=GameHub Team, O=GameHub, L=City, ST=State, C=CN'
    ].join(' ');

    try {
      execSync(keytoolCmd, { stdio: 'inherit' });
    } catch (e) {
      console.log('⚠️  签名密钥生成失败，但项目仍可继续（使用调试签名）');
    }
  }

  console.log('\n✅ Capacitor 初始化完成！');
  console.log('\n📝 下一步:');
  console.log('   1. 同步代码: npm run apk:sync');
  console.log('   2. 构建 APK: npm run apk:build');

} catch (error) {
  console.error('\n❌ 初始化失败:', error.message);
  process.exit(1);
}
