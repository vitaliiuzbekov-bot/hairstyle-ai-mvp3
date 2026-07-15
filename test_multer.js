import express from 'express';
import multer from 'multer';
import FormData from 'form-data';
import fetch from 'node-fetch';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.post('/test', upload.single('image'), (req, res) => {
    res.json({ body: req.body, file: !!req.file });
});

app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message });
});

app.listen(3333, async () => {
    const fd = new FormData();
    fd.append('selfieImage', Buffer.from('hello'), { filename: 'a.jpg' });
    fd.append('keyword', 'test');
    
    const res = await fetch('http://localhost:3333/test', {
        method: 'POST',
        body: fd
    });
    const data = await res.json();
    console.log("Result:", data);
    process.exit();
});
