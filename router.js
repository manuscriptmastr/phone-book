const url = require('url');
const phoneBook = require('./storage').phoneBook;

const router = () => {

  const routes = [
    {method: 'GET', url: /^\/contacts\/?$/, handle: phoneBook.get},
    {method: 'POST', url: /^\/contacts\/?$/, handle: phoneBook.add},
    {method: 'DELETE', url: /^\/contacts\/?$/, handle: phoneBook.remove}
  ];

  let lookupRoute = req => {
    return routes.find(({ method, url }) => {
      return req.method === method && url.test(req.url)
    });
  };

  let handleRequest = (req, data) => {
    let route = lookupRoute(req);

    if (!route) {
      return Promise.resolve('Could not find anything');
    } else {
      return route.handle(data);
    }
  }

  return {
    handleRequest
  }
}

let Router = router();

module.exports = Router;