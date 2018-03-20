const fs = require('fs');
const promisify = require('util').promisify;
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

var storage = fileName => {

  var generateId = () => Math.floor(Math.random() * 100**10);

  var get = () => {
    var contents = readFile(fileName);

    return contents
      .then(data => JSON.parse(data))
      .catch(err => Promise.resolve([]));
  }

  var save = (arr) => {
    var contents = JSON.stringify(arr);

    return writeFile(fileName, contents);
  }

  var add = obj => {
    obj.id = generateId();
    var arr = get();

    return arr
      .then(a => a.concat([obj]))
      .then(a => save(a));
  }

  var remove = (id, arr) => {
    var arr = get();

    return arr
      .then(a => a.filter(obj => obj.id !== id))
      .then(a => save(a));
  }

  return {
    get,
    add,
    remove
  }

}

module.exports = storage;