const send = document.getElementById('send');
const message_element = document.getElementById('message');
send.addEventListener("click", (e)=>{
    send_message();
});
message_element.addEventListener("keydown", e=>{
    if (e.ctrlKey && (e.key === 'Enter')) {
        send_message();
    }
});

function page_event(page){
    const PAGE_LIMIT = 5;
    get_messages_from((page -1) * PAGE_LIMIT).then(async resp=>{
        if (resp.status === 200) {
            const {messages, n_messages, start, end} = await resp.json();
            const n_pages = Math.ceil(n_messages/PAGE_LIMIT);
            update_page_buttons(page, n_pages);
            update_messages(messages);
        }
    });
}
function send_message(){
    if (message_element.value.trim() != '') {
        fetch('/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({message: message_element.value})
        }).then(response=>{
            if (response.status === 200) {
                message_element.value = '';
            }
            page_event(parseInt(document.getElementById('current page').innerHTML));
        });
    }
}
function update_page_buttons(page, n_pages){
    const button_list = [];
    let min_page = Math.max(1, page - 3);
    let max_page = Math.min(page + 3, n_pages);
    for (let i = min_page; i <= max_page; i++) {
        let button = document.createElement("button");
        button.className = "page";
        if (i === page) {
            button.id = "current page";
        };
        button.innerHTML = i;
        button.addEventListener("click", ()=>{page_event(i);});
        button_list.push(button);
    }
    if (n_pages === 0) {
        let button = document.createElement("button");
        button.className = "page";
        button.id = "current page";
        button.innerHTML = 1;
        button.addEventListener("click", ()=>{page_event(1);});
        button_list.push(button);
    }
    if (page !== 1) {
        const prev_button = document.createElement("button");
        prev_button.className = "prev button";
        prev_button.innerHTML = "&laquo";
        prev_button.addEventListener("click", ()=>{page_event(page - 1);});
        button_list.unshift(prev_button);
    }
    if (page !== n_pages) {
        const next_button = document.createElement("button");
        next_button.className = "next button";
        next_button.innerHTML = "&raquo";
        next_button.addEventListener("click", ()=>{page_event(page + 1);});
        button_list.push(next_button);
    }
    
    const select_button = document.createElement("select");
    select_button.append(...create_page_options(page, n_pages));
    select_button.id = "select page";
    select_button.addEventListener("change", ()=>{
        page_event(parseInt(select_button.value));
    });
    button_list.push(select_button);

    document.getElementById("pagination").innerHTML = '';
    document.getElementById("pagination").append(...button_list);
}

function update_messages(messages){
    document.getElementById("messages").innerHTML = '';
    document.getElementById("messages").append(...messages.map(message=>{
        const para = document.createElement("p");
        para.innerText = message.message;
        return para;
    }));
}

function get_messages_from(start){
    return fetch(`/get?start=${start}`, {
        method: 'GET',
    })
}
const get_messages_loop = ()=> {
    setTimeout(() => {
        page_event(parseInt(document.getElementById('current page').innerHTML));
        get_messages_loop();
    }, 3000);
}
function current_page() {
    parseInt(document.getElementById('current page').innerHTML);
}

function create_page_options(curr_page, n_pages){
    option_list = [];
    for (let page = 1; page <= Math.max(n_pages, 1); page++){
        let option = document.createElement("option");
        option.innerText = `page ${page}`;
        if (page === curr_page) {
            option.setAttribute("selected", "true");
        }
        option.value = page;
        option_list.push(option);
    }
    return option_list;
}
page_event(1);
get_messages_loop();