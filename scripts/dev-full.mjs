import { spawn } from 'node:child_process';
import process from 'node:process';

const children = [
  spawn(process.execPath, ['server/index.js'], { stdio: 'inherit', shell: false }),
  spawn(process.execPath, ['node_modules/vite/bin/vite.js'], { stdio: 'inherit', shell: false }),
];

function stopChildren() {
  for (const child of children) {
    if (!child.killed) child.kill();
  }
}

for (const child of children) {
  child.on('error', (error) => {
    console.error(`Failed to start child process: ${error.message}`);
    stopChildren();
    process.exitCode = 1;
  });
  child.on('exit', (code, signal) => {
    if (code && !process.exitCode) process.exitCode = code;
    if (signal && !process.exitCode) process.exitCode = 1;
  });
}

process.on('SIGINT', () => { stopChildren(); process.exit(0); });
process.on('SIGTERM', () => { stopChildren(); process.exit(0); });
