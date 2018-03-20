const http = require('http');
const phoneBook = require('./storage').phoneBook;

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.end('Hello there!');
  } else {
    res.end('You asked for ' + req.url);
  }
});

server.listen(3000);