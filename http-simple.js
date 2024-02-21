import http from 'http'
import url from 'url'
import path from 'path'
import fs from 'fs'
import mime from 'mime'

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const http = require('http');
// const url = require('url');
// const path = require('path');
// const fs = require('fs');
// const mime = require('mime')

const server = http.createServer((req, res) => {
  // let filePath = path.resolve(__dirname, path.join('www', url.fileURLToPath(`file:///${req.url}`)));

  let filePath = path.join(__dirname, 'www', req.url);
  console.log('path', filePath)

  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
    if (fs.existsSync(filePath)) {
      const { ext } = path.parse(filePath);
      const stats = fs.statSync(filePath);
      const timeStamp = req.headers['if-modified-since'];

      let status = 200;

      if (timeStamp && Number(timeStamp) === stats.mtimeMs) {
        // 如果timeStamp和stats.mtimeMS相等，说明文件内容没有修改
        status = 304
      }
      res.writeHead(status, {
        'Content-Type': mime.getType(ext),
        'Cache-Control': 'max-age=86400', // 缓存一天
        'last-modified': stats.mtimeMs,
      });

      if (status === 200) {
        const fileStream = fs.createReadStream(filePath)
        fileStream.pipe(res)
      } else {
        res.end() // 如果状态码不是200，则不需要返回body
      }

    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>Not Found</h1>');
  }
});




server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

server.listen(8080, () => {
  console.log('opened server on', server.address());
});
