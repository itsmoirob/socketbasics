var socket = io();

socket.on('connect', function () {
    console.log('Connected to socket.io server!');
});

socket.on('message', function (message) {
    var momentTimestamp = moment.utc(message.timestamp).local().format('ddd DD MMM h:mmA');

    console.log('New message:');
    console.log(message.text);

    jQuery('.messages').append('<p><strong>' + momentTimestamp + ':</strong> ' + message.text + '</p>');
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