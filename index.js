const express = require('express');
const app = express();
app.listen(8080, ()=>{
    console.log('start!');
});
app.use(express.static('public'));
app.use(express.json());

const messages = [];
app.post('/send', (request, response)=>{
    const {message} = request.body
    store_message(message, Date.now());
    response.json({});
});
app.get('/get', (request, response)=>{
    response.json({messages});
})
function store_message(message, time) {
    messages.push({message, time});
    console.log(messages);
}
