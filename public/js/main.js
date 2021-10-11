const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
let userCount = 0;

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {

  var item = document.getElementById("activeUsers");
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
    userCount += 1;
    item.innerHTML = userCount;

  });
  userCount = 0;
}

//Prompt the user before leave chat room
document.getElementById('leave-btn-nav').addEventListener('click', () => {
  const leaveRoom = confirm('Want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
    userCount -= 1;
  } else {
  }
});

// Toggle Emoji Picker
const togglePicker = document.getElementById("emoji");
const emojiPicker = document.getElementById('emoji-picker');
console.log({togglePicker});
console.log({emojiPicker});
togglePicker.addEventListener('click',(e) =>{
    e.preventDefault();
    console.log("Clicked togglePicker!");
    emojiPicker.classList.toggle("invisible");
});

function insertAtCursor(myField, myValue) {
  if (document.selection) {
      myField.focus();
      sel = document.selection.createRange();
      sel.text = myValue;
  }
  else if (myField.selectionStart || myField.selectionStart == '0') {
      var startPos = myField.selectionStart;
      var endPos = myField.selectionEnd;
      myField.value = myField.value.substring(0, startPos)
          + myValue
          + myField.value.substring(endPos, myField.value.length);
  } else {
      myField.value += myValue;
  }
}

// Listen for emoji-click events and add unicode to text-box 
emojiPicker.addEventListener("emoji-click", (event) => {
  let textBox = document.getElementById('msg');
  const unicodeEmoji = event.detail.unicode;
  
  // Inserting unicode character at current cursor-location in input field
  insertAtCursor(textBox,unicodeEmoji);
});  

document.getElementById('mobile-menu').addEventListener('click', () => {
  let x = document.getElementById('chat-sidebar');
  if (x.style.display === "flex") {
    x.style.display = "none";
  } else {
    x.style.display = "flex";
  }
}
)

//Prompt the user before leave chat room
document.getElementById('leave-btn-mobile').addEventListener('click', () => {
  const leaveRoom = confirm('Want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});
