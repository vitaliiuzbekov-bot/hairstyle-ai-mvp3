const fs = require('fs');
const dirs = fs.readdirSync('/proc');
for (const dir of dirs) {
  if (isNaN(dir)) continue;
  try {
    const cmd = fs.readFileSync(`/proc/${dir}/cmdline`, 'utf8');
    if (cmd.includes('node') && !cmd.includes('kill_all')) {
      console.log(`Killing PID ${dir}: ${cmd.replace(/\0/g, ' ')}`);
      process.kill(dir, 'SIGKILL');
    }
  } catch (e) {}
}
