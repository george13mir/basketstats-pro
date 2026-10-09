function crearDbAsync(db) {

  function all(sql, params = []) {

    return new Promise((resolve, reject) => {

      db.all(sql, params, (err, rows) => {

        if (err) {
          reject(err);
          return;
        }

        resolve(rows);
      });

    });
  }


  function get(sql, params = []) {

    return new Promise((resolve, reject) => {

      db.get(sql, params, (err, row) => {

        if (err) {
          reject(err);
          return;
        }

        resolve(row);
      });

    });
  }


  function run(sql, params = []) {

    return new Promise((resolve, reject) => {

      db.run(sql, params, function (err) {

        if (err) {
          reject(err);
          return;
        }

        resolve({
          id: this.lastID,
          cambios: this.changes
        });

      });

    });
  }


  return {
    all,
    get,
    run
  };
}


module.exports = crearDbAsync;