import db from "../SQLiteDatabse";

const dataatual=()=>{
  var date = new Date().getDate();
  var month = new Date().getMonth() + 1;
  var year = new Date().getFullYear();
  var hours =  (new Date().getHours() < 10 ? '0':'') + new Date().getHours();
  var min =  (new Date().getMinutes() < 10 ? '0':'') + new Date().getMinutes();
  return year + '-' + month + '-' + date;
}
const datahoraatual=()=>{
  var date = new Date().getDate();
  var month = new Date().getMonth() + 1;
  var year = new Date().getFullYear();
  var hours =  (new Date().getHours() < 10 ? '0':'') + new Date().getHours();
  var min =  (new Date().getMinutes() < 10 ? '0':'') + new Date().getMinutes();
  return year + '-' + month + '-' + date + ' ' + hours + ':' + min + ':00';//format: dd-mm-yyyy hh:ii:00;
}


const create = (obj) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
       tx.executeSql(
         "INSERT INTO midia (timestamp, route_id, user_id,	type,	file,	lat,	long, up,	created) values (?,?,?,?,?,?,?,?,?)",
         [obj.timestamp, obj.route_id, obj.user_id,	obj.type,	obj.file,	obj.lat,	obj.long, obj.up,	obj.created],
         //-----------------------
         (_, { rowsAffected, insertId }) => {
           if (rowsAffected > 0) resolve(insertId);
           else reject("Error inserting obj: " + JSON.stringify(obj)); // insert falhou
         },
         (_, error) => reject(error) // erro interno em tx.executeSql
       );
    });
  });
};


const insert = (obj) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
       tx.executeSql(
        "INSERT INTO midia (timestamp, route_id, user_id,	type,	file,	lat,	long, up,	created) values (?,?,?,?,?,?,?,?,?)",
         [obj.timestamp, obj.route_id, obj.user_id,	obj.type,	obj.file,	obj.lat,	obj.long, obj.up,	obj.created],
         //-----------------------
         (_, { rowsAffected, insertId }) => {
           if (rowsAffected > 0) resolve(insertId);
           else reject("Error inserting obj: " + JSON.stringify(obj)); // insert falhou
         },
         (_, error) => reject(error) // erro interno em tx.executeSql
       );
    });
  });
};


const find = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        "SELECT * FROM midia WHERE route_id = ?",
        [id],
        //-----------------------
        (_, { rows }) => {
          if (rows.length > 0) resolve(rows._array[0]);
          else reject("Midia não encontrada: title = " + id); // nenhum registro encontrado
        },
        (_, error) => reject(error) // erro interno em tx.executeSql
      );
    });
  });
};


const findByTitle = (title) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        "select * from midia WHERE title = ?;",
        [title],
        //-----------------------
        (_, { rows }) => {
          if (rows.length > 0) { console.log(rows); resolve(rows._array); } 
          else reject("nada encontrado: title=" + title); // nenhum registro encontrado
        },
        (_, error) => reject(error) // erro interno em tx.executeSql
      );
    });
  });
};



const all = (id) => {
  return new Promise((resolve, reject) => {
    console.log('Midias listando');
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        "SELECT * FROM midia WHERE route_id = ?",
        [id],
        //"Select * from midiacoordinates",
        //"SELECT name FROM sqlite_master WHERE type IN ('table','view') AND name NOT LIKE 'sqlite_%' UNION ALL SELECT name FROM sqlite_temp_master WHERE type IN ('table','view') ORDER BY 1",
        //"pragma table_info('users')",
        //"pragma table_info('midiacoordinates')",
        //-----------------------
        (_, { rows }) => resolve(rows._array),
        (_, error) => reject(error) // erro interno em tx.executeSql
      );
    });
  });
  
};

const allup = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM midia  WHERE route_id = ?;", // 
        [id],
        //-----------------------
        (_, { rows }) => resolve(rows._array),
        (_, error) => reject(error) // erro interno em tx.executeSql
      );
    });
  });
};


const remove = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        "DELETE FROM midia WHERE id=?;",
        [id],
        //-----------------------
        (_, { rowsAffected }) => {
          resolve(rowsAffected);
        },
        (_, error) => reject(error) // erro interno em tx.executeSql
      );
    });
  });
};

export default {
  create,
  insert,
  allup,
  find,
  findByTitle,
  all,
  remove,
  datahoraatual,
  dataatual,
};
