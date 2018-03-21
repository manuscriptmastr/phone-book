const http = require('http');
const router = require('./router');

const server = http.createServer((req, res) => {
  var body = '';

  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    var data = body.length ? JSON.parse(body) : '';
    router.handleRequest(req, data)
      .then(data => res.end(JSON.stringify(data)));
  });
});

server.listen(3000);