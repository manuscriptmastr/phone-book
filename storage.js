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

    let data = contents
      .then(data => JSON.parse(data))
      .catch(err => Promise.resolve([]));

    if (id) {
      data = data
        .then(a => a.find(d => d.id === id))
        .catch(() => Promse.resolve('No entry found'));
    }

    return data;
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

  let update = (obj, id) => {
    let arr = get();
    let newObj = arr
      .then(a => {
        var foundObj = a.find(o => o.id === id);
        
        if (!foundObj) {
          return Promise.resolve('No entry found');
        }

        Object.assign(foundObj, obj);

        return save(a).then(() => foundObj);
      });

    return newObj;
  }

  return {
    get,
    add,
    remove,
    update
  }

}

let phoneBook = storage('phonebook.json');

module.exports = {
  phoneBook
};