import http from 'http'
import url from 'url'
import path from 'path'
import fs from 'fs'
import mime from 'mime'
import zlib from 'zlib'

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


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

      const mimeType = mime.getType(ext);
      console.log("🚀 ~ server ~ mimeType:", mimeType)
      const responseHeaders = {
        'Content-Type': mimeType,
        'Cache-Control': 'max-age=86400', // 缓存一天
        'Last-Modified': stats.mtimeMs,
      }

      const acceptEncoding = req.headers['accept-encoding'];
      const compress = acceptEncoding && /^(text|application)\//.test(mimeType)

      if (compress) {
        // 返回客户端支持的一种压缩方式
        acceptEncoding.split(/\s*,\s*/).some((encoding) => {
          if (encoding === 'gzip') {
            responseHeaders['Content-Encoding'] = 'gzip';
            return true;
          }
          if (encoding === 'deflate') {
            responseHeaders['Content-Encoding'] = 'deflate';
            return true;
          }
          if (encoding === 'br') {
            responseHeaders['Content-Encoding'] = 'br';
            return true;
          }
          return false;
        });
      }

      const compressionEncoding = responseHeaders['Content-Encoding']; // 获取选中的压缩方式

      let status = 200;

      if (timeStamp && Number(timeStamp) === stats.mtimeMs) {
        // 如果timeStamp和stats.mtimeMS相等，说明文件内容没有修改
        status = 304
      }

      res.writeHead(status, responseHeaders);


      if (status === 200) {
        const fileStream = fs.createReadStream(filePath);
        if (compress && compressionEncoding) {
          let comp;

          // 使用指定的压缩方式压缩文件
          if (compressionEncoding === 'gzip') {
            comp = zlib.createGzip();
          } else if (compressionEncoding === 'deflate') {
            comp = zlib.createDeflate();
          } else {
            comp = zlib.createBrotliCompress();
          }
          fileStream.pipe(comp).pipe(res);
        } else {
          fileStream.pipe(res);
        }
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
