var socket = io();

socket.on('connect', function () {
    console.log('Connected to socket.io server!');
});

socket.on('message', function (message) {
    console.log('New message:');
    console.log(message.text);
})

// Handles submitting of new message
var $form = jQuery('#message-form');
var $message = $form.find('input[name=message]');

$form.on('submit', function (event) {
    event.preventDefault();
    socket.emit('message', {
        text: $message.val()
    });

    $message.val('');
    // this.reset();

});