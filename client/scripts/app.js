var app = {};
//why do I need this below?? 
window.app = app;

app.userName = prompt('Enter your username. Make it a good one!');
app.server = 'https://api.parse.com/1/classes/chatterbox';
app.chatRooms = {main: true};
app.friends = {};

//click listeners for interaction with the html
app.init = function() {
	console.log("initted");
	app.username = window.location.search.substr(10);
	app.loadAll();
	app.text = $('#messageInput');
	app.roomMenu = $('#roomSelect');

	$('.submit').on('click', app.handleSubmit);

	$("#createRoom").on("click", app.addRoom);

	$('.chatUser').on('click', app.addFriend); 

	$('#refresh').on("click", function() {
		app.clearMessages();
		app.fetch();
	});
};

//compiles message content for sending
app.handleSubmit = function(e) {
	//this is for preventing default form behavior (refresh after submission)
	e.preventDefault();
	var message = {
		'username': app.escaper(app.userName),
		'text': app.escaper(app.text.val()),
		'roomname': app.roomMenu.val()
	}; 
	app.text.val('');
	app.send(message);
};

//send messages to server
app.send = function(message) {
	$.ajax({
		url: app.server,
		type: 'POST',
		data: JSON.stringify(message),
		contentType: 'application/json',
		success: function() {
			console.log('chatterbox: Message sent');
		},
		error: function() {
			console.error('chatbox: Failed to send message');
		}
	});
};

//get new messages from server
app.fetch = function() {
	$.ajax({
		url: app.server,
		type:'GET',
		data: {order: '-createdAt'},
		contentType: 'application/json',
		success: function(json) {
			_.each(json.results, function(message) {
				app.addMessage(message);
			});
		},
		complete: function (json) {
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


//add message to DOM once fetched
app.addMessage = function(message) {

		var cleanText = app.escaper(message.text);
		var cleanUserName = app.escaper(message.username);
	  var cleanRoomName = app.escaper(message.roomname) || undefined;

		var messageText = $("<div class='chatContent'>" + cleanText + "</div>");
		var messageUser = $("<span class='chatUser'>" + cleanUserName + ": " + "</span>");
		var messageRoom = $("<br/><br/><span class='whichRoom'>" + "[" + cleanRoomName + "] " + "</span>");
		var messageContainer = $("<div class='container'></div>");

		messageText.prepend(messageUser);
		messageText.prepend(messageRoom);
		messageContainer.append(messageText);


		$('#chats').append(messageContainer);
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
	if (!friends[newFriend]) {
			friends[newFriend] = true;
	}
	$('.chatUser:contains(' + newFriend + ')').closest('.container').toggleClass('friend');
}; 


app.loadAll = function () {
	app.fetch();
	setInterval(app.fetch, 10000);
};

//create a friend class
//show anything with friend class in bold
//click a username, add it to friend list if not already there
//add friend class to everything in friend list
