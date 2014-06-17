var app = {};
//why do I need this below?? 
window.app = app;


//in init, fumction on click, take message, room, and 
//  username input and trigger app.send
//function to create chat rooms
//function to create messages
//addMessagesToDom function
//  takes message.text and creates a div
//  add username/friendname and chatRoom as span in message

app.userName = prompt('Enter your username. Make it a good one!');
app.chatRoom = {};
app.friend = {};



app.init = function() {
	//event listeners

};

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
app.fetch = function() {
	$.ajax({
		url: 'https://api.parse.com/1/classes/chatterbox',
		type:'GET',
		success: function(data) {
			//addMessagesToDom
	});
};

// message: {
// 'username': 'shawndrost',
// 'text': 'trololo',
// 'roomname': '4chan'
// };


