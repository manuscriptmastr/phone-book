const fs = require('fs');
const promisify = require('util').promisify;
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

let storage = fileName => {

  let generateId = () => Math.floor(Math.random() * 100**10);

  let save = (arr) => {
    let contents = JSON.stringify(arr);

    return writeFile(fileName, contents);
  }

  let get = (id) => {
    let contents = readFile(fileName);

    return contents
      .then(data => JSON.parse(data))
      .catch(err => Promise.resolve([]))
      .then(data => id ? data.find(d => d.id === id) : data);
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

    arr.then(a => a.filter(obj => obj.id !== id))
      .then(a => save(a));

    return arr
      .then(a => a.find(obj => obj.id === id))
      .catch(() => Promise.resolve('No entry found'));
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