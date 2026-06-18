import { spawn } from 'child_process';
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';

const logFile = fs.openSync('test_log.txt', 'w');
const server = spawn('npx', ['tsx', 'server.ts'], { stdio: ['ignore', logFile, logFile] });

setTimeout(async () => {
  try {
    const fd = new FormData();
    if (fs.existsSync('face.jpg')) fd.append('photo', fs.createReadStream('face.jpg'));
    fd.append('user_id', 'test_123');

    fs.appendFileSync('test_log.txt', "\nFetching http://127.0.0.1:3001/api/hairstyle/analyze...\n");
    const r = await fetch("http://127.0.0.1:3001/api/hairstyle/analyze", {
      method: "POST",
      body: fd as any
    });
    fs.appendFileSync('test_log.txt', `\nStatus: ${r.status}\n`);
    const text = await r.text();
    fs.appendFileSync('test_log.txt', `\nBody: ${text}\n`);
  } catch (err) {
    fs.appendFileSync('test_log.txt', `\nError: ${err}\n`);
  } finally {
    server.kill('SIGKILL');
  }
}, 5000);
