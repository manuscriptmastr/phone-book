const pg = require('pg-promise')();

let storage = dbName => {
  let db = pg(`postgres://joshuamartin@localhost:5432/${dbName}`);

  let get = (id) => {
    let data = db.query(`SELECT * FROM contact WHERE id = '${id}'`);
    return data;
  }

  let getAll = () => {
    let data = db.query('SELECT * FROM contact');
    return data;
  }

  let add = ({first_name, last_name, phone}) => {
    let data = db.query(
      `
        INSERT INTO contact
          (first_name, last_name, phone)
        VALUES
          ('${first_name}', '${last_name}', '${phone}') 
        RETURNING *
      `
    );
    return data;
  }

  let remove = (id) => {
    let data = db.query(`DELETE FROM contact WHERE id = '${id}' RETURNING *`);
    return data;
  }

  return {
    get,
    getAll,
    add,
    remove
  }

}

let phoneBook = storage('phonebook');

module.exports = {
  phoneBook
};