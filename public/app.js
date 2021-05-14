const send = document.getElementById('send');
send.addEventListener("click", (e)=>{
    if (document.getElementById('message').value.trim() != '') {
        fetch('/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({message: document.getElementById('message').value})
        }).then(response=>{
            if (response.status === 200) {
                document.getElementById('message').value = '';
            }
        });
    }
});
function get_messages_loop() {
    setTimeout(()=>{
        fetch('/get', {
            method: 'GET',
        }).then(async response=>{
            if (response.status === 200) {
                const {messages} = await response.json();
                document.getElementById("messages").innerHTML = '';
                document.getElementById("messages").append(...messages.map(element=>{
                    const para = document.createElement('P');
                    para.innerText = element.message;
                    return para;
                }));
            }
            get_messages_loop();
        });
    }, 1000);
}
get_messages_loop();