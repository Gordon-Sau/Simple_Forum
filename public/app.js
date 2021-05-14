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
            page_event(parseInt(document.getElementById('current page').innerHTML));
        });
    }
});

const page_event = (page)=>{
    const PAGE_LIMIT = 5;
    get_messages_from((page -1) * PAGE_LIMIT).then(async resp=>{
        if (resp.status === 200) {
            const {messages, n_messages, start, end} = await resp.json();
            console.log({messages, n_messages, start, end});
            const button_list = [];
            const n_pages = Math.ceil(n_messages/PAGE_LIMIT);
            for (let i = 1; i <= n_pages; i++) {
                let button = document.createElement("button");
                button.className = "page";
                if (i === page) {
                    button.id = "current page";
                };
                button.innerHTML = i;
                button.addEventListener("click", ()=>{page_event(i);});
                button_list.push(button);
            }
            if (n_pages == 0) {
                let button = document.createElement("button");
                button.className = "page";
                button.id = "current page";
                button.innerHTML = 1;
                button.addEventListener("click", ()=>{page_event(1);});
                button_list.push(button);
            }
            if (start !== 0) {
                const prev_button = document.createElement("button");
                prev_button.className = "prev button";
                prev_button.innerHTML = "&laquo";
                prev_button.addEventListener("click", ()=>{page_event(page - 1);});
                button_list.unshift(prev_button);
            }
            if (end !== -1) {
                const next_button = document.createElement("button");
                next_button.className = "next button";
                next_button.innerHTML = "&raquo";
                next_button.addEventListener("click", ()=>{page_event(page + 1);});
                button_list.push(next_button);
            }
            document.getElementById("pagination").innerHTML = '';
            document.getElementById("pagination").append(...button_list);
            document.getElementById("messages").innerHTML = '';
            document.getElementById("messages").append(...messages.map(message=>{
                const para = document.createElement("p");
                para.innerText = message.message;
                return para;
            }));
        }
    });
}

const get_messages_from = (start)=>{
    return fetch(`/get?start=${start}`, {
        method: 'GET',
    })
}
page_event(1);
const get_messages_loop = ()=> {
    setTimeout(() => {
        page_event(parseInt(document.getElementById('current page').innerHTML));
        get_messages_loop();
    }, 3000);
}
const current_page = ()=> {
    parseInt(document.getElementById('current page').innerHTML);
}
get_messages_loop();
