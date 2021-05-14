const express = require('express');
const sqlite = require('sqlite3').verbose();
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

const messages = [];
const PAGE_LIMIT = 5;

app.post('/send', (request, response)=>{
    const {message} = request.body
    store_message(message, Date.now());
    response.json({});
});
app.get('/get', (request, response)=>{
    const start = parseInt(request.query.start);
    const end = ((start + PAGE_LIMIT) >= messages.length)? -1:(start+PAGE_LIMIT);
    response.json({
        messages: get_message(start),
        n_messages: messages.length,
        start: start,
        end: end
    });
});

const get_message = (start)=>{
    return messages.slice(start, PAGE_LIMIT + start);
}
const store_message = (message, time)=>{
    messages.unshift({message, time});
}
