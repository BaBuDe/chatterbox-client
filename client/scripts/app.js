var app = {};
//why do I need this below?? 
window.app = app;

app.userName = prompt('Enter your username. Make it a good one!');
app.server = 'https://api.parse.com/1/classes/chatterbox';
app.chatRooms = {main: true};
app.friends = {};

//click listeners for interaction with the html
app.init = function() {
	console.log("running");
	// app.username = window.location.search.substr(10);
	app.text = $('#messageInput');
	app.loadAll();
	app.roomMenu = $('#roomSelect');

	$('.submit').on('click', app.handleSubmit);

	$("#createRoom").on("click", app.addRoom);

	$('#chats').on('click', '.chatUser', function() {
		var selectedUser = $(this).text();
		app.addFriend(selectedUser);
	});

	$('#refresh').on("click", function() {
		app.clearMessages();
		app.fetch();
	});
};

app.loadAll = function () {
	app.fetch();
	setInterval(app.fetch, 10000);
};

//compiles message content for sending
app.handleSubmit = function(e) {
	e.preventDefault();

	var message = {
		'username': app.escaper(app.userName),
		'text': app.escaper(app.text.val()),
		'roomname': app.roomMenu.val()
	}; 
	app.text.val('');
	app.send(message);
};

//add message to DOM once fetched
app.addMessage = function (message) {
	var cleanText = app.escaper(message.text);
	var cleanUserName = app.escaper(message.username);
  var cleanRoomName = app.escaper(message.roomname) || undefined;


	var messageText = $("<div class='chatContent'>" + cleanText + "</div>");
	var messageUser = $("<span class='chatUser'>" + cleanUserName + "</span>");
	var messageRoom = $("<br/><br/><span class='whichRoom'>" + "[" + cleanRoomName + "] " + "</span>");
	var messageContainer = $("<div class='container'></div>");

	messageContainer.append(messageRoom, messageUser, messageText);

	if (app.friends[cleanUserName]) {
		messageContainer.toggleClass('friend');
	}

	return messageContainer;
};

app.addToDom = function (message) {
  var readyMessage = app.addMessage(message);
  $('#chats').prepend(readyMessage);
}

app.processMessages = function (messages) {
	for( var i = messages.length; i > 0; i-- ){
    app.addToDom(messages[i-1]);
  }
}

//get new messages from server
app.fetch = function() {
	$.ajax({
		url: app.server,
		type:'GET',
		data: {order: '-createdAt'},
		contentType: 'application/json',
		success: function(json) {
			app.processMessages(json.results);
		},
		complete: function (json) {
		}
	});
};

//send messages to server
app.send = function(message) {
	$.ajax({
		url: app.server,
		type: 'POST',
		data: JSON.stringify(message),
		contentType: 'application/json',
		success: function(json) {
			console.log('chatterbox: Message sent');
			app.addToDom(message);
		},
		error: function() {
			console.error('chatbox: Failed to send message');
		}
	});
};
//escape user input for incoming and outoging messages and usernames
app.escaper = function(input) {
	if (input !== undefined && input !== null) {
	return input
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/\"/g, '&quot;')
		.replace(/\'/g, '&#39;');
	}
};

//clear messages from DOM
app.clearMessages = function() {
	$('#chats').empty();
};

//create new chat room
app.addRoom = function() {
	var newRoomName = prompt("What do you want to call this room?");
	if (!app.chatRooms[newRoomName]) {
		app.chatRooms[newRoomName] = true;
	}
	$("#roomSelect").append('<option value=' + newRoomName + '>' + newRoomName + '</option>');
};

//add friends
app.addFriend = function (newFriend) {
	if (!app.friends[newFriend]) {
			app.friends[newFriend] = true;
	} else {
		delete app.friends[newFriend];
	}
}; 
