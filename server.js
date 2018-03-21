const http = require('http');
const url = require('url');
const phoneBook = require('./storage').phoneBook;

const server = http.createServer((req, res) => {
  var urlObj = url.parse(req.url);
  var body = '';

  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {

    if (req.method === 'GET') {
      phoneBook.get().then(entries => {
        res.end(JSON.stringify(entries));
      });
    }

    if (req.method === 'POST') {
      var data = JSON.parse(body);
      phoneBook.add(data).then(entry => {
        res.end(JSON.stringify(entry));
      });
    }

    else {
      res.end();
    }

    // if (req.method === 'DELETE') {
    //   console.log(req.url);
    //   phoneBook.remove(id).then(() => {
    //     res.end(`Deleted ${id}`);
    //   });
    // }

  });
});

server.listen(3000);