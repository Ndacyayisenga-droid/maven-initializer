#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Colors for console output
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

// Function to check if a command exists
function commandExists(command) {
    return new Promise((resolve) => {
        const { spawn } = require('child_process');
        const process = spawn('which', [command], { stdio: 'ignore' });
        process.on('close', (code) => resolve(code === 0));
    });
}

// Function to start a process
function startProcess(command, args, options, name) {
    return new Promise((resolve, reject) => {
        log(`🔧 Starting ${name}...`, 'green');
        
        const process = spawn(command, args, {
            stdio: 'inherit',
            ...options
        });

        process.on('error', (error) => {
            log(`❌ Failed to start ${name}: ${error.message}`, 'red');
            reject(error);
        });

        process.on('spawn', () => {
            log(`✅ ${name} started successfully`, 'green');
            resolve(process);
        });
    });
}

async function main() {
    log('🚀 Starting Maven Initializer Servers...', 'blue');

    // Check prerequisites
    log('🔍 Checking prerequisites...', 'yellow');
    
    const nodeExists = await commandExists('node');
    if (!nodeExists) {
        log('❌ Node.js is not installed. Please install Node.js first.', 'red');
        process.exit(1);
    }

    const mvnExists = await commandExists('mvn');
    if (!mvnExists) {
        log('❌ Maven is not installed. Please install Maven first.', 'red');
        process.exit(1);
    }

    const javaExists = await commandExists('java');
    if (!javaExists) {
        log('❌ Java is not installed. Please install Java 17+ first.', 'red');
        process.exit(1);
    }

    // Check if node_modules exists, if not install dependencies
    const fs = require('fs');
    if (!fs.existsSync('node_modules')) {
        log('📦 Installing frontend dependencies...', 'yellow');
        const npmInstall = spawn('npm', ['install'], { stdio: 'inherit' });
        await new Promise((resolve, reject) => {
            npmInstall.on('close', (code) => {
                if (code === 0) resolve();
                else reject(new Error(`npm install failed with code ${code}`));
            });
        });
    }

    // Start backend server
    const backendProcess = await startProcess('mvn', ['spring-boot:run'], {
        cwd: path.join(__dirname, 'backend')
    }, 'Backend server (Spring Boot)');

    // Wait a moment for backend to start
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Start frontend server
    const frontendProcess = await startProcess('npm', ['run', 'dev'], {
        cwd: __dirname
    }, 'Frontend server (Next.js)');

    log('✅ Both servers are starting up!', 'blue');
    log('📱 Frontend: http://localhost:3000', 'yellow');
    log('🔧 Backend: http://localhost:8080', 'yellow');
    log('Press Ctrl+C to stop both servers', 'yellow');

    // Handle cleanup on exit
    const cleanup = () => {
        log('\n🛑 Shutting down servers...', 'yellow');
        backendProcess.kill();
        frontendProcess.kill();
        process.exit(0);
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);

    // Wait for processes to exit
    await Promise.all([
        new Promise(resolve => backendProcess.on('exit', resolve)),
        new Promise(resolve => frontendProcess.on('exit', resolve))
    ]);
}

main().catch(error => {
    log(`❌ Error: ${error.message}`, 'red');
    process.exit(1);
});
