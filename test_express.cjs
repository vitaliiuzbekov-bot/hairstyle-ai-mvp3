const express = require('express');
const app = express();

const router = express.Router();
router.post('/analyze', (req, res) => {
  res.json({ route: 'analyzeRouter' });
});

app.use('/api/analyze', (req, res, next) => {
  console.log('middleware strip, req.url:', req.url, ' req.originalUrl:', req.originalUrl);
  next();
});

app.use('/api', router);

app.use('*', (req, res) => {
  res.send('HTML FALLBACK');
});

const http = require('http');
const server = http.createServer(app);
server.listen(4000, () => {
  http.request({ port: 4000, path: '/api/analyze', method: 'POST' }, (res) => {
    let data = '';
    res.on('data', d => data += d);
    res.on('end', () => {
      console.log('Response:', data);
      process.exit(0);
    });
  }).end();
});
