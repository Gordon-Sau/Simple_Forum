const sqlite3 = require('sqlite3');
let db = new sqlite3.Database('./simple_forum.db', (err)=>{
    if (err) throw err;
    console.log('Connected');
})

// create table
db.run(`CREATE TABLE messages(
    ID INTEGER PRIMARY KEY NOT NULL,
    message text NOT NULL,
    time INTEGER NOT NULL
)`);
db.close((err)=>{
    if(err) console.log(err.name);
    console.log('close connection');
});