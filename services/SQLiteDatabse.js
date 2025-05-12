import * as SQLite from 'expo-sqlite/legacy';

const db = SQLite.openDatabase("db.db", '1.0', 'rutas', 2 * 1024 * 1024)

//http://www.riobambaciclorutas.com/api/coord.json
//http://www.riobambaciclorutas.com/api/routes.json
//http://www.riobambaciclorutas.com/api/userlist.json
//https://www.riobambaciclorutas.com/api/route/1696111655.json
//https://www.riobambaciclorutas.com/api/coord/1696111655.json
//https://www.riobambaciclorutas.com/api/midias/1693680933.json


db.transaction((tx) => {
  //console.log("apagando as tabelas.");
   //tx.executeSql("DROP TABLE routescoordinates;");
   //tx.executeSql("DROP TABLE routes;");
   //tx.executeSql("DROP TABLE users;");
   //tx.executeSql("DROP TABLE midia;");
});

db.transaction((tx) => {
  //<<<<<<<<<<<<<<<<<<<<<<<< USE ISSO APENAS DURANTE OS TESTES!!! >>>>>>>>>>>>>>>>>>>>>>>
    console.log("Criandos as tabelas.");

    tx.executeSql("CREATE TABLE IF NOT EXISTS  routescoordinates  (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INT,   route_id INT, timestamp BIGINT, lat TEXT, lgt TEXT, created BIGINT);");
    tx.executeSql("CREATE TABLE IF NOT EXISTS  routes             (id INTEGER PRIMARY KEY AUTOINCREMENT, timestamp INT, title TEXT, image TEXT, audio TEXT, obs TEXT, country TEXT, state TEXT, city TEXT, lat TEXT, log TEXT, codapp INT, type TEXT, up INT, user_id INT, created TEXT);");
    tx.executeSql("CREATE TABLE IF NOT EXISTS  users              (id INTEGER PRIMARY KEY, title TEXT, email TEXT , phone TEXT)");
    tx.executeSql("CREATE TABLE IF NOT EXISTS  midia              (id INTEGER PRIMARY KEY AUTOINCREMENT, route_id INT,  user_id INT, timestamp BIGINT,	type TEXT,	file TEXT,	lat TEXT,	long TEXT, up INT,	created TEXT)");
    
    
    // tx.executeSql("CREATE TABLE IF NOT EXISTS  routescoordinates  (id INTEGER PRIMARY KEY AUTOINCREMENT, route_id INT, lat TEXT, lgt TEXT, created TEXT);");
    // tx.executeSql("CREATE TABLE IF NOT EXISTS  routes             (id INTEGER PRIMARY KEY AUTOINCREMENT, timestamp INT, title TEXT, image TEXT, audio TEXT, obs TEXT, country TEXT, state TEXT, city TEXT, lat TEXT, log TEXT, codapp INT, up INT, user_id INT, created TEXT);");
    // tx.executeSql("CREATE TABLE IF NOT EXISTS  users              (id INTEGER PRIMARY KEY, title TEXT, email TEXT , phone TEXT)");
    // tx.executeSql("CREATE TABLE IF NOT EXISTS  midia              (id INTEGER PRIMARY KEY AUTOINCREMENT, route_id INT,  user_id INT, timestamp BIGINT,	type TEXT,	file TEXT,	lat TEXT,	long TEXT, up INT,	created TEXT)");
    
    console.log("Tabelas criadas.");
});

export default db

