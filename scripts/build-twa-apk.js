const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const WORK_DIR = path.resolve(__dirname, '..', 'apk-build');
const JAVA_HOME = 'C:\\Program Files\\Amazon Corretto\\jdk17.0.19_10';
const ANDROID_SDK_ROOT = path.join(WORK_DIR, 'android-sdk');
const KEYSTORE_PATH = path.join(WORK_DIR, 'gameacg.keystore');
const KEYSTORE_PASS = 'gameacg2024';
const KEY_ALIAS = 'gameacg';
const KEY_PASS = 'gameacg2024';

function log(msg) { console.log(`[BUILD] ${msg}`); }

function run(cmd, opts = {}) {
    log(`执行: ${cmd.substring(0, 80)}...`);
    return execSync(cmd, {
        stdio: 'pipe',
        encoding: 'utf-8',
        cwd: opts.cwd || WORK_DIR,
        env: { ...process.env, JAVA_HOME, ANDROID_SDK_ROOT },
        maxBuffer: 50 * 1024 * 1024,
        timeout: 600000,
        ...opts
    });
}

// 安装SDK组件（非交互）
function installSdkComponents() {
    const sdkmanager = path.join(ANDROID_SDK_ROOT, 'cmdline-tools', 'latest', 'bin', 'sdkmanager.bat');
    if (!fs.existsSync(sdkmanager)) { log('sdkmanager不存在，跳过'); return; }

    // 确保license文件格式正确
    const licDir = path.join(ANDROID_SDK_ROOT, 'licenses');
    if (!fs.existsSync(licDir)) fs.mkdirSync(licDir, { recursive: true });

    fs.writeFileSync(path.join(licDir, 'android-sdk-license'),
        '\n24333f8a63b6825ea9c5514f83c2829b004d59ee');
    fs.writeFileSync(path.join(licDir, 'android-sdk-preview-license'),
        '\n84831b9409646a918e30573bab29c121cc75a8');

    const pkgs = ['platforms;android-34', 'build-tools;34.0.0'];
    try {
        run(`"${sdkmanager}" ${pkgs.join(' ')} --sdk_root="${ANDROID_SDK_ROOT}"`);
        log('SDK组件安装完成');
    } catch(e) {
        log('SDK组件安装警告: ' + (e.stderr||'').substring(0,200));
    }
}

// 用spawn+模式匹配驱动bubblewrap init（核心）
function bubblewrapInit() {
    const twaDir = path.join(WORK_DIR, 'android_twa');
    // 预建目录，避免 "Directory does not exist" 提示
    if (!fs.existsSync(twaDir)) fs.mkdirSync(twaDir, { recursive: true });

    if (fs.existsSync(path.join(twaDir, 'gradlew.bat'))) {
        log('TWA项目已存在，跳过init');
        return twaDir;
    }

    return new Promise((resolve, reject) => {
        log('启动bubblewrap init (自动应答模式)...');

        // 启动临时HTTP服务器提供manifest（解决Windows路径问题）
        const http = require('http');
        const fs2 = require('fs');
        const server = http.createServer((req, res) => {
            const filePath = path.join(WORK_DIR, 'twa-manifest.json');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(fs2.readFileSync(filePath));
        });
        server.listen(18789, () => {
            log('临时HTTP服务器启动在 http://localhost:18789');
        });

        const manifestUrl = 'http://localhost:18789/twa-manifest.json';

        const proc = spawn('bubblewrap', [
            'init',
            '--manifest', manifestUrl,
            '--directory', 'android_twa'
        ], {
            cwd: WORK_DIR,
            env: { ...process.env, JAVA_HOME, ANDROID_SDK_ROOT },
            shell: true,
            stdio: ['pipe', 'pipe', 'pipe']
        });

        let buf = '';
        let answered = 0;

        // 定义所有可能的提示模式及其答案
        const DOMAIN = 'bianyujin.github.io';
        const START_URL = '/gameapp2/';
        const APP_NAME = 'GAMEACG 游戏整合平台';
        const SHORT_NAME = 'GAMEACG';
        const PKG_ID = 'io.github.bianyujin.gameacg';

        // 定义所有可能的提示模式及其答案（按Bubblewrap实际提示顺序）
        const patterns = [
            // 阶段1：SDK安装确认
            { re: /install.*Android SDK.*recommended/i, send: 'y\n' },
            // 阶段2：目录创建
            { re: /Directory.*does not exist|want to create|create it now/i, send: 'y\n' },
            // 阶段3：许可证
            { re: /agree.*terms.*conditions/i, send: 'y\n' },
            // 阶段4：Web app details (1/5)
            { re: /\? Domain:/i, send: DOMAIN + '\n' },
            { re: /\? URL path:/i, send: START_URL + '\n' },
            // 阶段5：Android app details (2/5)
            { re: /\? Application name:/i, send: '\n' },
            { re: /\? Short name:/i, send: '\n' },
            { re: /\? Application ID:/i, send: '\n' },
            { re: /Package Name/i, send: '\n' },
            // Display mode 和 Orientation 是方向键选择器，发回车选默认
            { re: /\? Display mode:/i, send: '\r' },
            { re: /\? Orientation:/i, send: '\r' },
            // 阶段6：颜色设置 (3/5)
            { re: /\? Status bar color:/i, send: '\n' },
            { re: /\? Theme color:/i, send: '\n' },
            { re: /\? Background color:/i, send: '\n' },
            { re: /\? Navigation bar color:/i, send: '\n' },
            // 阶段7：图标和启动屏 (3/5)
            { re: /\? Splash screen color:/i, send: '#6366f1\n' },
            { re: /\? Icon URL/i, send: 'https://bianyujin.github.io/gameapp2/icons/icon-512x512.png\n' },
            { re: /\? Maskable Icon URL/i, send: 'https://bianyujin.github.io/gameapp2/icons/icon-512x512.png\n' },
            { re: /Monochrome icon URL/i, send: '\n' },
            // 阶段8：其他选项 (4/5)
            { re: /\? Enable notifications/i, send: '\n' },
            { re: /\? Enable shortcuts/i, send: '\n' },
            // 阶段9：版本信息
            { re: /Starting version code|version code for the new app/i, send: '200\n' },
            // 阶段10：签名 (5/5)
            { re: /keystore.*password|Keystore password/i, send: KEYSTORE_PASS + '\n' },
            { re: /key.*password|Key password/i, send: KEY_PASS + '\n' },
            { re: /Path to.*JDK|existing JDK/i, send: JAVA_HOME + '\n' },
            // 兜底Y/N确认
            { re: /\[y\/N\]:?\s*$/i, send: 'y\n' },
            { re: /\[Y\/n\]:?\s*$/i, send: 'y\n' },
            { re: /\(yes\/no\)|\(y\/n\):?\s*$/i, send: 'y\n' },
            { re: /\(Y\/n\):?\s*$/i, send: 'y\n' },
            // 最终兜底：任何未匹配的输入框都发回车（使用默认值）
            { re: /\? .+:\s*\([^)]+\)/, send: '\n' },
        ];

        function onData(data) {
            const text = data.toString();
            buf += text;
            process.stdout.write(text);

            for (const p of patterns) {
                if (p.re.test(buf) && !buf.includes('__done__' + p.re.source)) {
                    buf += '__done__' + p.re.source;
                    log(` [自动应答 #${answered + 1}] 匹配: ${p.re.source}`);
                    // Windows需要\r\n作为换行符
                    proc.stdin.write(p.send.replace(/\n/g, '\r\n'));
                    answered++;
                    break;
                }
            }
        }

        proc.stdout.on('data', onData);
        proc.stderr.on('data', onData);

        const timer = setTimeout(() => {
            proc.kill();
            reject(new Error('超时(10min)'));
        }, 600000);

        proc.on('close', (code) => {
            clearTimeout(timer);
            server.close();
            if (code === 0) { resolve(twaDir); }
            else { reject(new Error(`bubblewrap退出码: ${code}, 已应答${answered}次`)); }
        });
    });
}

// Gradle构建
function gradleBuild(twaDir) {
    const gradlew = path.join(twaDir, 'gradlew.bat');
    if (!fs.existsSync(gradlew)) throw new Error('gradlew.bat不存在');

    // 写入签名配置
    const propsPath = path.join(twaDir, 'keystore.properties');
    fs.writeFileSync(propsPath, [
        `storePassword=${KEYSTORE_PASS}`,
        `keyPassword=${KEY_PASS}`,
        `keyAlias=${KEY_ALIAS}`,
        `storeFile=${KEYSTORE_PATH.replace(/\\/g, '/')}`
    ].join('\n'));

    // 修改build.gradle加入签名
    const bgPath = path.join(twaDir, 'app', 'build.gradle');
    if (fs.existsSync(bgPath)) {
        let bg = fs.readFileSync(bgPath, 'utf-8');
        if (!bg.includes('signingConfigs')) {
            bg = bg.replace(/android\s*\{/, `android {\n    def kp = new Properties()\n    kp.load(new FileInputStream(rootProject.file('keystore.properties')))\n\n    signingConfigs {\n        release {\n            keyAlias kp['keyAlias']\n            keyPassword kp['keyPassword']\n            storeFile file(kp['storeFile'])\n            storePassword kp['storePassword']\n        }\n    }`);
            bg = bg.replace(/release\s*\{/, 'release {\n            signingConfig signingConfigs.release');
            fs.writeFileSync(bgPath, bg);
            log('已注入签名配置到build.gradle');
        }
    }

    log('执行 gradlew assembleRelease...');
    run(`"${gradlew}" assembleRelease --no-daemon`, { cwd: twaDir });

    // 查找APK
    const searchDirs = [
        path.join(twaDir, 'app', 'build', 'outputs', 'apk', 'release'),
        path.join(twaDir, 'app', 'build', 'outputs', 'apk')
    ];

    for (const d of searchDirs) {
        if (!fs.existsSync(d)) continue;
        for (const f of fs.readdirSync(d)) {
            if (f.endsWith('.apk')) return path.join(d, f);
        }
    }
    throw new Error('未找到APK输出');
}

async function main() {
    console.log('\n========================================');
    console.log('  GAMEACG TWA APK 自动构建 v2.0');
    console.log('========================================\n');

    log('检查环境...');
    if (!fs.existsSync(KEYSTORE_PATH)) throw new Error('keystore不存在');
    if (!fs.existsSync(JAVA_HOME)) throw new Error('JDK不存在');
    log(`Java: ${run(`"${path.join(JAVA_HOME,'bin','java.exe')}" -version`).split('\n')[0].trim()}`);

    log('安装SDK组件...');
    installSdkComponents();

    const twaDir = await bubblewrapInit();

    log('Gradle构建中... (可能需要几分钟下载依赖)');
    const apkPath = gradleBuild(twaDir);

    // 复制到output目录
    const outDir = path.join(WORK_DIR, 'output');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const finalApk = path.join(outDir, 'GAMEACG-v2.0.apk');
    fs.copyFileSync(apkPath, finalApk);

    const sizeMB = (fs.statSync(finalApk).size / 1024 / 1024).toFixed(2);
    console.log('\n========================================');
    console.log('  构建成功!');
    console.log(`  APK: ${finalApk}`);
    console.log(`  大小: ${sizeMB} MB`);
    console.log('========================================\n');
}

main().catch(err => {
    console.error('\n[失败]', err.message);
    process.exit(1);
});
