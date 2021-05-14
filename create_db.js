const sqlite3 = require('sqlite3');
let db = new sqlite3.Database('./simple_forum.db', (err)=>{
    if (err) throw err;
    console.log('Connected');
})

// create table
db.run(`CREATE TABLE Messages(
    message text
)`);
db.close((err)=>{
    if(err) throw err;
    console.log('close connection');
});