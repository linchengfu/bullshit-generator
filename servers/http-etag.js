import checksum from 'checksum';
import http from 'http'
import url from 'url'
import fs from 'fs'
import mime from 'mime'
import path from 'path'

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = http.createServer((req, res) => {
  const srvUrl = url.parse(`http://${req.url}`)
  let reqPath = srvUrl.path;
  if (reqPath === '/') reqPath = '/index.html';

  let resPath = path.join(__dirname, 'www', reqPath);

  if (!fs.existsSync(resPath)) {
    res.writeHead(404, { 'content-type': 'text/html' })
    return res.end('<h1>404 Not found</h1>')
  }


  checksum.file(resPath, (err, sum) => {
    const resStream = fs.createReadStream(resPath)
    sum = `"${sum}"`;


    if (req.headers['if-none-match'] === sum) {
      res.writeHead(304, {
        'content-type': mime.getType(resPath),
        etag: sum
      })
      res.end()
    } else {
      res.writeHead(200, {
        'content-type': mime.getType(resPath),
        etag: sum
      })

      resStream.pipe(res)
    }
  })
})

server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
})

server.listen(8081, () => {
  console.log('opened server on', server.address())
})