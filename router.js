const url = require('url');
const phoneBook = require('./storage').phoneBook;

const router = () => {

  const routes = [
    {method: 'GET', pattern: /^\/contacts\/?$/, handle: phoneBook.get},
    {method: 'GET', pattern: /^\/contacts\/([0-9]+)\/?$/, handle: phoneBook.get},
    {method: 'POST', pattern: /^\/contacts\/?$/, handle: phoneBook.add},
    {method: 'DELETE', pattern: /^\/contacts\/?$/, handle: phoneBook.remove}
  ];

  let lookupRoute = req => {
    return routes.find(({ method, pattern }) => {
      return req.method === method && pattern.test(req.url)
    });
  };

  let handleRequest = (req, data) => {
    let route = lookupRoute(req);

    if (!route) {
      return Promise.resolve('Could not find anything');
    }
    
    let pattern = route.pattern;
    let tokens = pattern.exec(req.url);
    return route.handle(data, tokens);
  }

  return {
    handleRequest
  }
}

let Router = router();

module.exports = Router;