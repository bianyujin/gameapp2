const { execSync } = require('child_process');
const path = require('path');

const WORK_DIR = path.join(__dirname, 'apk-build');

// Step 1: Run init with auto-responses
console.log('=== 初始化 Android 项目 ===');

// Use node to spawn and answer prompts
const { spawn } = require('child_process');

function runWithAnswers(cmd, args, answers, cwd) {
    return new Promise((resolve, reject) => {
        const proc = spawn(cmd, args, {
            cwd,
            stdio: ['pipe', 'pipe', 'pipe'],
            shell: true
        });
        
        let output = '';
        let answerIdx = 0;
        
        proc.stdout.on('data', (data) => {
            output += data.toString();
            console.log(data.toString().trim());
            
            // Check if it's asking for JDK
            if (data.toString().includes('install the JDK')) {
                proc.stdin.write('n\n');
                return;
            }
            // Path to JDK
            if (data.toString().includes('Path to your existing JDK')) {
                proc.stdin.write('C:\\Program Files\\Amazon Corretto\\jdk17.0.19_10\n');
                return;
            }
            // Keystore password
            if (data.toString().includes('keystore password') || data.toString().includes('password for')) {
                proc.stdin.write('gameacg2024\n');
                return;
            }
            // Key password
            if (data.toString().includes('key password') || data.toString().includes('key alias')) {
                proc.stdin.write('gameacg2024\n');
                return;
            }
            // Confirm values (y/n)
            if (data.toString().includes('(Y/n)') || data.toString().includes('(y/N)')) {
                proc.stdin.write('y\n');
                return;
            }
            // Any other prompt - send default/yes
            if (output.endsWith(': ') || output.endsWith('? ')) {
                if (answerIdx < answers.length) {
                    proc.stdin.write(answers[answerIdx++] + '\n');
                } else {
                    proc.stdin.write('\n');
                }
            }
        });
        
        proc.stderr.on('data', (data) => {
            process.stderr.write(data);
        });
        
        proc.on('close', (code) => {
            if (code === 0) resolve(output);
            else reject(new Error(`Process exited with code ${code}\n${output}`));
        });
        
        // Timeout after 5 minutes
        setTimeout(() => {
            reject(new Error('Timeout'));
        }, 300000);
    });
}

async function main() {
    try {
        await runWithAnswers(
            'bubblewrap',
            ['init', '--manifest', 'https://bianyujin.github.io/gameapp2/manifest.json'],
            [],
            WORK_DIR
        );
        
        console.log('\n=== 构建 APK ===');
        
        await runWithAnswers(
            'bubblewrap',
            ['build'],
            ['y'],
            WORK_DIR
        );
        
        console.log('\n=== 打包完成！===');
        console.log('APK 文件位于:', path.join(WORK_DIR, 'app-release-signed.apk'));
        
    } catch (err) {
        console.error('错误:', err.message);
        process.exit(1);
    }
}

main();
