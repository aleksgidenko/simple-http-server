#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const http = require('http')
const port = 8080

const requestListener = (req, res) => {
  process.stdout.write(req.url)

  let filePath = '.' + req.url
  if (filePath === './') { 
    filePath = './index.html'
  }

  const fileExt = path.extname(filePath)

  let contentType = 'text/html'
  switch (fileExt) {
    case '.css':
      contentType = 'text/css'
      break
    case '.js':
      contentType = 'text/javascript'
      break
    case '.png':
      contentType = 'image/png'
      break
    case '.jpg':
      contentType = 'image/jpg'
      break
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        process.stdout.write(' -> 404\n')
        res.writeHead(404).end('File not found')
      } else {
        process.stdout.write(' -> 500\n')
        res.writeHead(500).end('Something went wrong')
      }
    } else {
      process.stdout.write(' -> 200\n')
      res.writeHead(200, {
        'Content-Type': contentType
      }).end(content, 'utf-8')
    }
  })
}

const server = http.createServer(requestListener)

server.listen(port, err => {
  if (err) {
    return console.log(`failed to start server on port ${port}`)
  }
  console.log(`http server running`)
  console.log(`http://localhost:${port}/`)
})