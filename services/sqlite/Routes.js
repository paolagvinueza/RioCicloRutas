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
         "INSERT INTO routes (timestamp, title, image, audio, obs, country, state, city, lat, log, codapp, up, type, user_id, created) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
         [obj.timestamp, obj.title, obj.image, obj.audio, obj.obs, obj.country, obj.state, obj.city, obj.lat, obj.log, obj.codapp, obj.up, obj.type, obj.user_id, obj.created],
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
         "INSERT INTO routes (timestamp, title, image, audio, obs, country, state, city, lat, log, codapp, up, type, user_id, created) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
         [obj.timestamp, obj.title, obj.image, obj.audio, obj.obs, obj.country, obj.state, obj.city, obj.lat, obj.log, obj.codapp, obj.up, obj.type, obj.user_id, obj.created],
         //-----------------------
         (_, { rowsAffected, insertId }) => {
          console.log('retoro do insert', rowsAffected)
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
        "SELECT * FROM routes WHERE id = ?",
        [id],
        //-----------------------
        (_, { rows }) => {
          if (rows.length > 0) resolve(rows._array[0]);
          else reject("Rota não encontrada: title = " + id); // nenhum registro encontrado
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
        "select * from routes WHERE title = ?;",
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

const updateaudio = (id, obj) => {
  console.log("tentando atualizar o audio: "+ id + " - " + obj );
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        "UPDATE routes SET audio=? WHERE id=?",
        [obj, id],
        //-----------------------
        (_, { rowsAffected }) => { 
          if (rowsAffected > 0) resolve(rowsAffected);
          else reject("Erro ao atualizar o censo com o: id=" + id); // nenhum registro alterado
        },
        (_, error) => reject(error) // erro interno em tx.executeSql
      );
    });
  });
};


const routesup = (idp) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT id as 'codapp', timestamp, title, image, audio, obs, country, state, city, lat, log, type, user_id FROM routes WHERE (id = ?)", 
        [idp],
        //-----------------------
        (_, { rows }) => resolve(rows._array),
        (_, error) => reject(error) // erro interno em tx.executeSql
      );
    });
  });
};


const all = () => {
  return new Promise((resolve, reject) => {
    console.log('Rotas listando');
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        "select * from routes order by id desc",
        [],
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
        "DELETE FROM routes WHERE id=?;",
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

const updateup = (id) => { 

  console.log('update -> ' + id);
  
      updateu(id); 
      
      
  }

  const updateu = (id) => {
    console.log("Dado para ser atualizados: " + id);
     return new Promise((resolve, reject) => {
       db.transaction((tx) => {
         tx.executeSql(
           "UPDATE routes SET up=1 WHERE id = ?",
           [id],
           //-----------------------
           (_, { rowsAffected }) => {
             if (rowsAffected > 0) resolve(rowsAffected);
             else reject("Error updating obj: id=" + id); // nenhum registro alterado
           },
           (_, error) => reject(error) // erro interno em tx.executeSql
         );
       });
     });
  };
  const updatenull = (id) => {
    console.log("Dado para ser anulado: " + id);
     return new Promise((resolve, reject) => {
       db.transaction((tx) => {
         tx.executeSql(
           "UPDATE routes SET up=0 WHERE id = ?",
           [id],
           //-----------------------
           (_, { rowsAffected }) => {
             if (rowsAffected > 0) resolve(rowsAffected);
             else reject("Error updating obj: id=" + id); // nenhum registro alterado
           },
           (_, error) => reject(error) // erro interno em tx.executeSql
         );
       });
     });
  };

export default {
  create,
  insert,
  routesup,
  updateu,
  updateup,
  updatenull,
  updateaudio,
  find,
  findByTitle,
  all,
  remove,
  datahoraatual,
  dataatual,
};
