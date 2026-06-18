const { execSync } = require('child_process');
try {
  const output = execSync('netstat -nlp | grep :3000').toString();
  console.log(output);
  const match = output.match(/(\d+)\/node/);
  if (match) {
    console.log("Killing PID:", match[1]);
    execSync(`kill -9 ${match[1]}`);
  }
} catch (e) {
  console.log(e.stdout.toString());
}
