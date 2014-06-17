var app = {};
//why do I need this below?? 
window.app = app;


//in init, fumction on click, take message, room, and 
//  username input and trigger app.send
//  function to create chat rooms
//  function to create messages
//addMessagesToDom function
//  takes message.text and creates a div
//  add username/friendname and chatRoom as span in message

app.userName = prompt('Enter your username. Make it a good one!');
app.chatRooms = {};
app.friends = {};

app.renderMessage = function(message) {

	var messageText = $("<div class='chatContent'>" + message.text+ "</div>");

	var messageUser = $("<span class='user'>" + message.username+ "</span>");
	messageText.prepend(messageUser);

	var messageRoom = $("<br/><br/><span class='room'>" + message.roomname + "</span>");
	messageText.prepend(messageRoom);

	var messageContainer = $("<div class='container'></div>");
	messageContainer.append(messageText);

  $(."chatMessagesDiv").append(messageContainer);

}

//create new chat room
app.createNewRoom = function(name) {
	if (!app.chatRooms.message.roomname) {
		app.chatRooms.message.roomname = true;
	}
};

//send messages to server
app.send = function(message) {

	$.ajax({
		url: 'https://api.parse.com/1/classes/chatterbox',
		type: 'POST',
		data: JSON.stringify(message),
		contentType: 'application/json',
		success: function() {
			console.log('chatterbox: Message sent');
		},
		error: function(data) {
			console.error('chatbox: Failed to send message');
		}
	});

};

//get messages from server
app.fetch = function() {

	$.ajax({
		url: 'https://api.parse.com/1/classes/chatterbox',
		type:'GET',
		success: function(chats) {
			_.each(chats, function(chat) {
				renderMessages(chat);
			});
		}
	});

};

//click listeners for interaction with the html
app.init = function() {

	$('.sendMessages').on('click', function() {
			var userInput = $('.messageInput').val();
			var message = {
			'username':app.userName,
			'text': userInput,
			'roomname': chatRoom
			}; 
	  app.send(message);
	});

	$(".createRoom").on("click", function() {
			var newRoom = prompt("What do you want to call this room?");
			createNewRoom(newRoom);
	}); 

};
