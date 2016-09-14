var name = getQueryVariable('name') || 'Ghost';
var room = getQueryVariable('room');
var socket = io();

socket.on('connect', function () {
    console.log('Connected to socket.io server!');
    socket.emit('joinRoom', {
        name: name,
        room: room
    });
});

socket.on('message', function (message) {
    var momentTimestamp = moment.utc(message.timestamp).local().format('h:mm a');
    var $messages = jQuery('.messages');
    var $message = jQuery('<li class="list-group-item"></li>');

    console.log('New message:');
    console.log(message.text);

    $message.append('<p><strong>' + message.name + ' ' + momentTimestamp + ':</strong></p>');
    $message.append('<p>' + message.text + '</p>');
    $messages.append($message);
})

//Update room ID with room name parameter
jQuery('#room').text(room);

// Handles submitting of new message
var $form = jQuery('#message-form');
var $message = $form.find('input[name=message]');

$form.on('submit', function (event) {
    event.preventDefault();
    socket.emit('message', {
        text: $message.val(),
        name: name
    });

    $message.val('');
    // this.reset();

});