// limit contacts
var contactCount  = 5;

// most often needed elements
var mainElement   = document.querySelector('main');
var headerElement = document.querySelector('#app > header');
var contactsElement = document.querySelector('#contacts');
var chatElement     = document.querySelector('#chat');

var currentChat;

// store chats
/*

should have the following structure:

[
  'username-1': {
    msgs: [
      {time: 28712317, me: false, content: 'skjdh askgskd asjkdhdf.'},
      {time: 28712317, me: false, content: 'skjdh askgskd asjkdhdf.'},
      {time: 28712317, me: false, content: 'skjdh askgskd asjkdhdf.'},
    ]
  },
  'username-2': {
    msgs: [
      {time: 28712317, me: false, content: 'skjdh askgskd asjkdhdf.'},
      {time: 28712317, me: false, content: 'skjdh askgskd asjkdhdf.'},
      {time: 28712317, me: false, content: 'skjdh askgskd asjkdhdf.'},
    ]
  }
]

*/
var myChats = [];


/**************************************\
\**************************************/


// click handler to move to contacts
function toContacts(e) {
  mainElement.classList.remove('show-chat');
  e.preventDefault();
}

// click handler to move to chat
function toChat(e) {
  mainElement.classList.add('show-chat');
  e.preventDefault();
}

// click handler to move to a specific chat
function toSpecificChat(e) {
  var target = e.target;
  if(e.target.nodeName !== 'A') {
    target = e.target.parentElement;
  }
  var id = target.getAttribute('data-id');
  currentChat = id;
  renderChat(id);
  target.classList.remove('new-msg');
  toChat(e);
}


/**************************************\
\**************************************/


// register a new contact
function registerContact(JSONData) {
  JSONData.results.forEach(function(object) {
    if(!(object.login.username in myChats)) {
      myChats[object.login.username] = {
        msgs: []
      };
      renderContact(object);
    }
  });
}

// register a new message for given chat (username)
function registerMsg(object, username, me = false) {

  var tmpDiv = document.createElement("div");
  tmpDiv.innerHTML = object.text_out;

  myChats[username].msgs.push({
    time: new Date().getTime(),
    me: me,
    content: tmpDiv.textContent || tmpDiv.innerText || ""
  });

  renderContactNewMessage(username);
}


/**************************************\
\**************************************/


// render a contact
function renderContact(object) {

  var link = document.createElement('a');
  link.setAttribute('href', '#chat');
  link.setAttribute('data-id', object.login.username);
  link.innerHTML =
      `<img src="${object.picture.large}" alt="Profile picture of ${object.name.first} ${object.name.last}" />
      <div>
        ${object.name.first} ${object.name.last}
      </div>
    </a>
  `;

  link.addEventListener('click', toSpecificChat)
  contactsElement.append(link);
}

// render a chat thread
function renderChat(username) {
  chatElement.innerHTML = '';

  var chat = myChats[username];
  chat.msgs.forEach(function(object) {
    appendToChat(object);
  });

}

function appendToChat(object) {
  var p = document.createElement('p');
  if(object.me === true) {
    p.classList.add('me');
  }
  p.innerText = object.content;
  chatElement.append(p);
}

// renders a chat thread for given username
function renderContactNewMessage(username) {
  var contact = contactsElement.querySelector(`[data-id="${username}"]`);
  contact.classList.add('new-msg');
}


/**************************************\
\**************************************/


// loads JSON and call callback
function loadJSON(url, callback, param) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var response = JSON.parse(xhr.responseText);
    callback(response, param);
  };
  xhr.onerror = function() {
    console.log('XHeRror');
  }
  xhr.open('get', url);
  xhr.send();
}

// load actually one contact
function loadContact() {
  loadJSON('https://randomuser.me/api/', registerContact);
}

// load as many contacts as defined via var contactCount
function loadRandomContacts() {
  for (var i = 0; i < contactCount; i++) {
    loadContact();
  }
}

// load a random message to a random picked chat
function loadRandomMsg() {
  var rand = Math.random();

  if(rand < 0.25) {
    console.log('RND');
    var keys = Object.keys(myChats);
    var randUsername = keys[Math.floor(keys.length * Math.random())];
    loadJSON('https://www.randomtext.me/api/gibberish/p-1/1-15', registerMsg, randUsername);
  }
}


/**************************************\
\**************************************/


// apply header click handlers
var toContactsLink = headerElement.querySelector('a[href="#contacts"]');
toContactsLink.addEventListener('click', toContacts);

var toChatLink = headerElement.querySelector('a[href="#chat"]');
toChatLink.addEventListener('click', toChat);

// load random contacts
loadRandomContacts();

// load random chat message once in a while
var chatInterval = setInterval(loadRandomMsg, 300);
