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
            page_event(parseInt(document.getElementById('current page').innerText));
        });
    }
}

function create_page_button(id, className, innerHTML, innerText, event_type, event_func){
    const button = document.createElement("button");
    if (id !== null){
        button.id = id;
    }
    if (className !== null){
        button.className = className;
    }
    if (innerText !== null) {
        button.innerText = innerText;
    }
    if (innerHTML !== null) {
        button.innerHTML = innerHTML;
    }
    if (event_type !== null){
        button.addEventListener(event_type, event_func);
    }
    return button;
}

function page_button_list(page, n_pages) {
let page_list = [];
    let min_page = Math.max(1, page - 2);
    let max_page = Math.min(page + 2, n_pages);
    for (let i = min_page; i <= max_page; i++) {
        page_list.push(i);
    }
    if (min_page > 3){
        page_list = ["1", "2", "..."].concat(page_list);
    } else {
        for (let i = min_page - 1; i >= 1; i--) {
            page_list.unshift(i);
        }
    }
    if (max_page < n_pages - 2) {
        page_list.push("...");
        for (let i = n_pages - 1; i <=n_pages; i++) {
            page_list.push(i);
        }
    } else {
        for (let i = max_page + 1; i <= n_pages; i++) {
            page_list.push(i);
        }
    }
    return page_list;
}

function update_page_buttons(page, n_pages){
    const page_list = page_button_list(page, n_pages);
    const button_list = page_list.map(value=>{
        if (value == "...") {
            return create_page_button(null, null, null, value, null, null);
        } else if (value === page) {
            return create_page_button("current page","page", null, value, "click", ()=>{page_event(value);});
        }
        return create_page_button(null, "page", null, value, "click", ()=>{page_event(value);});
    })
    if (n_pages === 0) {
        button_list.push(create_page_button("current page", "page", null, "1", "click", ()=>{page_event(1);}));
    }
    if (page !== 1) {
        button_list.unshift(create_page_button("prev button", null, "&laquo", null, "click", ()=>{page_event(page - 1);}));
    }
    if (page !== n_pages) {
        button_list.push(create_page_button("next button", null, "&raquo", null, "click", ()=>{page_event(page + 1);}));
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
        page_event(current_page());
        get_messages_loop();
    }, 3000);
}
function current_page() {
    return parseInt(document.getElementById('current page').innerText);
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