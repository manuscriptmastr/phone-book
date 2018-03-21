const fs = require('fs');
const promisify = require('util').promisify;
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

let storage = fileName => {

  let generateId = () => Math.floor(Math.random() * 100**10);

  let get = () => {
    let contents = readFile(fileName);

    return contents
      .then(data => JSON.parse(data))
      .catch(err => Promise.resolve([]));
  }

  let save = (arr) => {
    let contents = JSON.stringify(arr);

    return writeFile(fileName, contents);
  }

  let add = obj => {
    obj.id = generateId();
    let arr = get();

    return arr
      .then(a => a.concat([obj]))
      .then(a => save(a))
      .then(() => Promise.resolve(obj));
  }

  let remove = (id) => {
    let arr = get();

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

let phoneBook = storage('phonebook.json');

module.exports = {
  phoneBook
};