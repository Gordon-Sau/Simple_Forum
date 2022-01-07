const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
app.listen(8080, ()=>{
    console.log('start!');
});
app.use(express.static('public'));
app.use(express.json());

let db = new sqlite3.Database('./simple_forum.db', (err)=>{
    if (err) throw err;
    console.log('Connected');
});

const PAGE_LIMIT = 5;

app.post('/send', (request, response)=>{
    const {message} = request.body;
    store_message(message, Date.now()).then(()=>{response.json({});});
});

app.get('/get', (request, response)=>{
    const start = parseInt(request.query.start);
    get_message(start).then(ret=>{
        response.json(ret);
    });
});

const get_message = async (start)=>{
    let end = start + PAGE_LIMIT;
    const messages = await query_messages(start, end);
    const n_messages = await query_count_messages();
    if (end >= n_messages) {
        end = -1;
    }
    return {
        messages,
        n_messages,
        start,
        end
    };
}

const query_messages = (start, end)=>{
    return new Promise((resolve, reject)=> {
        db.all("select message, time from (select row_number() over (order by time desc) rownum, * from messages) t where rownum between ? and ?;", [start + 1, end], (err, messages)=>{
            if (err) reject(err);
            resolve(messages);
        });
    });
}

const query_count_messages = ()=>{
    return new Promise((resolve, reject)=>{
        db.get("select count(*) from messages", (err, row)=>{
            if (err) reject(err);
            resolve(row['count(*)']);
        });
    });
}

const store_message = (message, time)=>{
    return new Promise((resolve, reject)=>{
        db.run(`INSERT INTO messages(message, time) VALUES (?, ?)`, [message, time], (err)=>{
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
