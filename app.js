const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const app = express();
const port = 5500;

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/list', (req, res) => {
    const directory = req.query.directory;
    fs.readdir(directory, (err, files) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ files });
    });
});

app.post('/create', (req, res) => {
    const directory = req.body.directory;
    fs.mkdir(directory, { recursive: true }, (err) => {
        if (err) {
            return res.status(500).send(`Error: ${err.message}`);
        }
        res.send(`Directory '${directory}' created successfully.`);
    });
});

app.post('/upload', upload.single('file'), (req, res) => {
    const dest = req.body.destination;
    const tempPath = req.file.path;
    const targetPath = path.join(dest, req.file.originalname);

    fs.rename(tempPath, targetPath, (err) => {
        if (err) {
            return res.status(500).send(`Error: ${err.message}`);
        }
        res.send(`File uploaded to '${targetPath}'`);
    });
});

app.post('/move', (req, res) => {
    const { src, dest } = req.body;
    fs.rename(src, dest, (err) => {
        if (err) {
            return res.status(500).send(`Error: ${err.message}`);
        }
        res.send(`File '${src}' moved to '${dest}'.`);
    });
});

app.post('/delete', (req, res) => {
    const file = req.body.file;
    fs.unlink(file, (err) => {
        if (err) {
            return res.status(500).send(`Error: ${err.message}`);
        }
        res.send(`File '${file}' deleted.`);
    });
});

app.listen(port, () => {
    console.log(`File management tool listening at http://localhost:${port}`);
});
