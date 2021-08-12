const loginBtn = document.querySelector('#loginBtn');
const signupBtn = document.querySelector('#signupBtn');
const newMessageBtn = document.querySelector('#newMessageBtn');

let token = localStorage.getItem("token");
let username = localStorage.getItem("username");

if (loginBtn) {
    loginBtn.addEventListener("click", async function (event) {
        event.preventDefault();
        const username = document.querySelector('#inputUsername1').value;
        const password = document.querySelector('#inputPassword1').value;

        const results = await axios.post('/auth/login', {username, password});
        token = results.data.token;

        localStorage.setItem("token", token);
        localStorage.setItem("username", username);

        window.location.href = "/messages/";
    })
}

if (signupBtn) {
    signupBtn.addEventListener("click", async function (event) {
        event.preventDefault();
        const username = document.querySelector('#inputUsername2').value;
        const password = document.querySelector('#inputPassword2').value;
        const first_name = document.querySelector('#inputFirst').value;
        const last_name = document.querySelector('#inputLast').value;
        const phone = document.querySelector('#inputPhone').value;

        const results = await axios.post('/auth/register', {username, password, first_name, last_name, phone});
        token = results.data.token;
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        window.location.href = "/messages/";
    })
}

if (newMessageBtn) {
    newMessageBtn.addEventListener("click", async function (event) {
        event.preventDefault();
        const to_username = document.querySelector('#inputToUsername').value;
        const body = document.querySelector('#inputBody').value;

        const results = await axios.post('/messages/', {to_username, body, "_token":token});
        console.log(results);
        window.location.href = "/messages/";
    })

}


document.addEventListener("DOMContentLoaded", async function(){
    const messageToDiv = document.querySelector("#messageToDiv");
    const messageToList = document.querySelector("#messageToList");
    const messageFromDiv = document.querySelector("#messageFromDiv");
    const messageFromList = document.querySelector("#messageFromList");

    if (messageToDiv) {
        const results1 = await axios.get(`/users/${username}/to`, {params: {"_token":token}});
        const messages_to = results1.data.messages;
        if (messages_to) {

            messageToDiv.classList.remove("d-none");
            for (let message of messages_to) {
                const newLi = document.createElement('li');
                newLi.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');
                messageToList.append(newLi);
                const newDiv = document.createElement('div');
                newDiv.innerText = message.body;
                newLi.append(newDiv);
                const newSpan = document.createElement('span');
                newSpan.innerText = message.from_user.username;
                newLi.append(newSpan);
            }
        }

        const results2 = await axios.get(`/users/${username}/from`, {params: {"_token":token}});
        const messages_from = results2.data.messages;
        if (messages_from) {
            messageFromDiv.classList.remove("d-none");
            for (let message of messages_from) {
                const newLi = document.createElement('li');
                newLi.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');
                messageFromList.append(newLi);
                const newDiv = document.createElement('div');
                newDiv.innerText = message.body;
                newLi.append(newDiv);
                const newSpan = document.createElement('span');
                newSpan.innerText = message.to_user.username;
                newLi.append(newSpan);
            }
        }
    }

})



// {% for message in to_messages %}
// <li><a href="/{{ message.id }}/">{{ message.id }}</a>{{ message.body }}<br>{{ message.from_username }}</li>
// {% endfor %} --></li>