const { exec } = require('child_process');

const port = 3000;

// Kill any process using port 3000
exec(`lsof -ti :${port}`, (err, stdout) => {
  if (stdout) {
    const pids = stdout.trim().split('\n').join(' ');
    exec(`kill -9 ${pids}`, (killErr) => {
      if (killErr) {
        console.error(`❌ Failed to free port ${port}`, killErr);
      } else {
        console.log(`✅ Freed up port ${port}`);
        startDev();
      }
    });
  } else {
    startDev();
  }
});

function startDev() {
  console.log(`🚀 Starting Next.js on port ${port}...`);
  const child = exec(`next dev -p ${port}`);
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
}
