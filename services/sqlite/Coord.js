import db from "../SQLiteDatabse";


const create = (obj) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        "INSERT INTO routescoordinates (user_id, timestamp, route_id, lat, lgt, created) values (?, ?, ?, ?, ?, ?);",
        [obj.user_id, obj.timestamp, obj.route_id, obj.lat, obj.lgt, obj.created],
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
      tx.executeSql(
        "INSERT INTO routescoordinates (user_id, timestamp, route_id, lat, lgt, created) values (?, ?, ?, ?, ?, ?);",
        [obj.user_id, obj.timestamp, obj.route_id, obj.lat, obj.lgt, obj.created],
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


//  const coordrota = (id) => {
//    return new Promise((resolve, reject) => {
//      db.transaction((tx) => {
//        //comando SQL modificável
//        tx.executeSql(
//          "SELECT lat as latitude, lgt as longitude FROM routescoordinates WHERE route_id=?;",
//          [id],
//          //-----------------------
//          (_, { rows }) => {
//            if (rows.length > 0) resolve(rows._array);
//            else reject("Obj not found: id=" + id); // nenhum registro encontrado
//          },
//          (_, error) => reject(error) // erro interno em tx.executeSql
//        );
//      });
//    });
//  };
const coordrota = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        "SELECT lat as latitude, lgt as longitude FROM routescoordinates WHERE route_id=?;",
        [id],
        //-----------------------
        (_, { rows }) => {
          if (rows.length > 0) {
            const coordArray = [];

            for (let i = 0; i < rows.length; i++) {
              const { latitude, longitude } = rows.item(i);
              const parsedLatitude = parseFloat(latitude);
              const parsedLongitude = parseFloat(longitude);

              coordArray.push({ latitude: parsedLatitude, longitude: parsedLongitude });
            }

            resolve(coordArray);
          } else {
            reject("Obj not found: id=" + id); // nenhum registro encontrado
          }
        },
        (_, error) => reject(error) // erro interno em tx.executeSql
      );
    });
  });
};


const find = () => {
  return new Promise((resolve, reject) => {
    //console.log('executando all');
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        "SELECT * FROM routescoordinates order id desc",
        [],
        //-----------------------
        (_, { rows }) => resolve(rows._array),
        (_, error) => reject(error) // erro interno em tx.executeSql
      );
    });
  });
  
};

const all = () => {
  return new Promise((resolve, reject) => {
    //console.log('executando all');
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        "SELECT * FROM routescoordinates;",
        [],
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
        "SELECT * FROM routescoordinates  WHERE route_id = ?;", // 
        [id],
        //-----------------------
        (_, { rows }) => resolve(rows._array),
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
  coordrota,
  all,
};
