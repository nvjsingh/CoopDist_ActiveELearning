$(document).ready(function(){
    var socket = io.connect();
    var $messageForm = $('#messagesend');
    var $message = $('#message');
    var $chat = $('#chatWindow');
    var $users = $('#users');
    var $username = document.getElementById("uname");
    var $gid = document.getElementById("hiddengid");
    var $error = $('#error');
    var $linkmodalsubmit = $('#linksubmit');
    var $linktxt = $('#linkmsg');

    setTimeout(function () {
        socket.disconnect();
        $.ajax({
            type: 'GET',
            url: '/timedlogout',
            success: function(result){
                window.location.href = 'http://localhost:3773/';
            },
            error: function(err){
                console.log(err);
            }
        });
    }, 5*60*1000);

    socket.emit('new user', $username.innerText, $gid.innerText, function(data){
    });

    socket.on('usernames', function(data){
        var html = '';
        for(i = 0;i < data.length;i++){
            html += data[i] + '<br>';
        }
        $users.html(html);
    });

    $messageForm.click(function(e){
        e.preventDefault();
        socket.emit('send message', $message.val());
        $message.val('');
    });

    $linkmodalsubmit.click(function(e){
        e.preventDefault();
        $("#shareLinkModal").modal("toggle");
        socket.emit('send message', $linktxt.val());
        $linktxt.val('');
    });

    socket.on('new message', function(data){
        $chat.append('<strong>'+data.user+'</strong>: '+data.msg+'<br>');
    });

});