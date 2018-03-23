const fs = require('fs');
const promisify = require('util').promisify;
const readFile = promisify(fs.readFile);
const url = require('url');
const path = require('path');
const phoneBook = require('./storage').phoneBook;

const routes = [
  {method: 'GET', pattern: /^\/contacts\/?([0-9]+)?\/?$/, handle: (data, tokens) => phoneBook.get(parseInt(tokens[1]))},
  {method: 'POST', pattern: /^\/contacts\/?$/, handle: phoneBook.add},
  {method: 'PUT', pattern: /^\/contacts\/([0-9]+)\/?$/, handle: (data, tokens) => phoneBook.update(data, parseInt(tokens[1]))},
  {method: 'DELETE', pattern: /^\/contacts\/?([0-9]+)?\/?$/, handle: (data, tokens) => phoneBook.remove(parseInt(tokens[1]))}
];

let lookupRoute = req => {
  return routes.find(({ method, pattern }) => {
    return req.method === method && pattern.test(req.url)
  });
};

let handleRoute = (req, data) => {
  let route = lookupRoute(req);
  if (!route) {
    return Promise.resolve('Could not find anything');
  }

  let pattern = route.pattern;
  let tokens = pattern.exec(req.url);

  return route.handle(data, tokens);
}

let handleRequest = (req, data) => {
  let contents = readFile(req.url.slice(1), 'utf-8');

  return contents.catch(() => handleRoute(req, data));
}

module.exports = {
  handleRequest
};