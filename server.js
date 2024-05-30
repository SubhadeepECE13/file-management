const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const port = 5500;
const baseDir = path.join(__dirname, 'files');
fs.writeFileSync(
    "first.text",
    "my first file"
);

const requestHandler = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  if (pathname === '/create-file' && method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const { filename, content } = JSON.parse(body);
      if (!filename || !content) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Filename and content are required');
        return;
      }
      const filePath = path.join(baseDir, filename);
      fs.writeFile(filePath, content, err => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Error writing file');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('File created');
      });
    });
  } else if (pathname === '/read-file' && method === 'GET') {
    const { filename } = parsedUrl.query;
    if (!filename) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Filename is required');
      return;
    }
    const filePath = path.join(baseDir, filename);
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error reading file');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(data);
    });
  } else if (pathname === '/delete-file' && method === 'DELETE') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const { filename } = JSON.parse(body);
      if (!filename) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Filename is required');
        return;
      }
      const filePath = path.join(baseDir, filename);
      fs.unlink(filePath, err => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Error deleting file');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('File deleted');
      });
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
};

const server = http.createServer(requestHandler);

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
