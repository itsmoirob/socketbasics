var socket = io();

socket.on('connect', function () {
    console.log('Connected to socket.io server!');
});

socket.on('message', function (message) {
    document.write('New message:</br>' );
    document.write(message.text, '</br>');
})