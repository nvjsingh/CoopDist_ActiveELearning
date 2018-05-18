var express = require('express'),
    path = require('path'),
    bp = require('body-parser'),
    cons = require('consolidate'),
    dust = require('dustjs-helpers'),
    pg = require('pg'),
    sessions = require('client-sessions'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ipc =require('node-ipc');

var conStr = "postgres://mypls:11@localhost/myplsdb";
app.engine('dust', cons.dust);
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));

app.use(bp.json());
app.use(bp.urlencoded({ extended: false}));
app.use(sessions({
    cookieName: 'session',
    secret: 'esfandyarikaurmaxwelsingh',
    duration: 10 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
}));

/********************************** Server init *******************************/

//var port = 3774;
//var uuid = 110;

var port = process.argv[2];
var uuid = process.argv[3];
var indexstr = 'http://localhost:3773/';
var globaluname = "";

ServerInit();

function ServerInit() {
    server.listen(port, function(){
        console.log('Server started on port ' + port);
    });
    startIPCServer();

    const { Client } = require('pg');

    const client = new Client({
        connectionString: conStr
    });

    client.connect(function (err) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
    });

    client.query('SELECT * FROM users WHERE uuid=$1',
        [uuid], function (err, resultusers) {
            if (err) {
                return console.error('error running query for username', err);
            }
            if (0 == resultusers.rows.length) return;
            globaluname = resultusers.rows[0].uname;
        });
}

setTimeout(function() {
    CloseServer();
}, 7 * 60 * 1000);

function startIPCServer() {
    ipc.config.id = uuid;
    ipc.config.retry= 1500;
    ipc.config.maxRetries = 3;
    ipc.config.stopRetrying = true;

    ipc.serve(
        function(){
            ipc.server.on(
                'app.message',
                function(data,socket){
                    var message = JSON.parse(data.message);
                    if ('text' == message.type) {
                        io.sockets.in(message.gid).emit('new message', {msg: message.msg, user: message.user});
                    } else if ('meta' == message.type) {
                        updateUsernames(message, data.id);
                    }
                }
            );
        }
    );
    ipc.server.start();
}

function requireLogin (req, res, next) {
    if (!req.session || !req.session.user) {
        res.redirect(indexstr);
    } else if (req.session.user == "admin") {
        res.redirect(indexstr);
    } else {
        next();
    }
}

function CloseServer(res) {
    console.log('Closing server on ' + port);
    if (null != res) {
        res.end();
    }
    server.close();
    process.exit();
}

app.get('/', function(req, res){
    req.session.user = uuid;
    res.redirect('/user');
});

app.get('/timedlogout', function(req, res) {
    req.session.reset();
    res.sendStatus(200);
    CloseServer(res);
});

app.get('/logout', function(req, res) {
    req.session.reset();
    res.redirect(indexstr);
    CloseServer(res);
});

/********************************** Dashboard ************************************/

app.get('/user', requireLogin, function(req, res){
    const { Client } = require('pg');

    const client = new Client({
        connectionString: conStr
    });

    client.connect(function (err) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
    });

    client.query('SELECT * FROM users WHERE uuid=$1',
        [req.session.user], function (err, result) {
        if (err) {
            return console.error('error running query for username', err);
        }
        res.render('user', {userinfo:result.rows});
    });
});

/********************************** Chat ************************************/

app.get('/chat', requireLogin, function(req, res){
    const { Client } = require('pg');

    const client = new Client({
        connectionString: conStr
    });

    client.connect(function (err) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
    });
    client.query('SELECT * FROM users WHERE uuid=$1',
        [req.session.user], function (err, resultusers) {
            if (err) {
                return console.error('error running query for username', err);
            }
            client.query('SELECT * FROM localuser_'+uuid+' WHERE uuid=$1',
                [req.session.user], function (err, resultlocal) {
                if (err) {
                    return console.error('error running query for topics', err);
                }
                var groupList = [];
                client.query('SELECT g_id, gname FROM mygroups', function (err, resultgid) {
                    if (err) {
                        return console.error('error running select query', err);
                    }
                    var gids = resultlocal.rows[0].my_gids;
                    if (0 != gids.length) {
                        for (var i = 0; i < gids.length; i++) {
                            for (var j = 0; j < resultgid.rows.length; j++){
                                if (gids[i] == resultgid.rows[j].g_id) {
                                    var data = {
                                        gid: resultgid.rows[j].g_id,
                                        gname: resultgid.rows[j].gname
                                    };
                                    groupList.push(data);
                                }
                            }
                        }
                    }
                    res.render('chat', {topics:resultlocal.rows[0].t_ids, userinfo:resultusers.rows, groups:groupList});
                });
            });
    });
});

//-----------Select Topic for creating Chat Room----------------
app.post('/selecttopic', requireLogin, function(req, res){
    const { Client } = require('pg');

    const client = new Client({
        connectionString: conStr
    });

    client.connect(function (err) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
    });

    var members = [];
    members.push(req.session.user);
    client.query('INSERT INTO mygroups(gname, t_id, admin, members) VALUES($1, $2 , $3, $4)',
        [req.body.gname,req.body.topicselect,req.session.user, members], function (err, result) {
        if (err) {
            return console.error('error running insert query', err);
        }
        client.query('SELECT * FROM mygroups ORDER BY g_id DESC LIMIT 1', function (err, resultgid) {
            if (err) {
                return console.error('error running select query', err);
            }
            UpdateUserGroups(client, req.session.user, resultgid.rows[0].g_id);
        });
    });

    client.query('SELECT * FROM users', function (err, resultusers) {
            if (err) {
                return console.error('error running query for username', err);
            }
            var interestedusers = [];
            var numusers = 0;
            if (0 == resultusers.rows.length) {
                return;
            }
            for (var x = 0; x < resultusers.rows.length; x++) {
                if (resultusers.rows[x].uuid == uuid) {
                    continue;
                }
                client.query('SELECT uuid, t_ids, uname  FROM localuser_' + resultusers.rows[x].uuid, function (err, result) {
                    if (err) {
                        return console.error('error running query for topics', err);
                    }
                    var i, j;
                    for (i = 0; i < result.rows.length; i++) {
                        if (!result.rows[i].t_ids) continue;
                        for (j = 0; j < result.rows[i].t_ids.length; j++) {
                            if (req.body.topicselect == result.rows[i].t_ids[j]) {
                                var data = {
                                    uuid: result.rows[i].uuid,
                                    users: result.rows[i].uname
                                };
                                interestedusers.push(data);
                            }
                        }
                    }
                    numusers++;
                    if (numusers == resultusers.rows.length - 1) {
                        res.render('chat', {userlocal: interestedusers});
                    }
                });
            }
        });
});

//-------------- Select Member For creating Chat Room-----
app.post('/selectmember', requireLogin, function(req, res){
    const { Client } = require('pg');

    const client = new Client({
        connectionString: conStr
    });

    client.connect(function (err) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
    });
    client.query('SELECT * FROM localuser_'+uuid+' WHERE uuid=$1',
        [req.session.user], function (err, resultuser) {
            if (err) {
                return console.error('error running query for localuser_'+uuid, err);
            }
            if(0 == resultuser.rows.length) return;
            var mygids = resultuser.rows[0].my_gids;
            var frm_name = resultuser.rows[0].uname;
            var gid = mygids[mygids.length - 1];
            var members = [];
            if (req.body.memberselect instanceof Array) {
                for (var i = 0; i < req.body.memberselect.length; i++) {
                    members.push(req.body.memberselect[i]);
                }
            } else {
                members.push(req.body.memberselect);
            }
            if (0 == members.length){
                return;
            }
            for (var i = 0; i < members.length; i++) {
                InsertNotifications(client, req.session.user, members[i], "invite", gid, frm_name);
            }
            res.redirect('/chat');
        });
});

app.post('/reqjoin', requireLogin, function(req, res){
    const { Client } = require('pg');

    const client = new Client({
        connectionString: conStr
    });

    client.connect(function (err) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
    });

    client.query('SELECT * FROM mygroups WHERE g_id=$1',
        [req.body.join], function (err, resultgrp) {
            if (err) {
                return console.error('error running query for localuser_'+uuid, err);
            }
            if(0 == resultgrp.rows.length) return;
            client.query('SELECT * FROM localuser_'+uuid+' WHERE uuid=$1',
                [req.session.user], function (err, resultuser) {
                    if (err) {
                        return console.error('error running query for localuser_'+uuid, err);
                    }
                    var frm_name = resultuser.rows[0].uname;
                    InsertNotifications(client, req.session.user, resultgrp.rows[0].admin, "reqjoin", req.body.join, frm_name);
                    res.redirect('/chat');
                });
        });
});

app.get('/exitgrp', requireLogin, function(req, res) {
    const {Client} = require('pg');

    const client = new Client({
        connectionString: conStr
    });

    client.connect(function (err) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
    });

    UpdateUserExitGrp(client, uuid, req.session.gid);
    UpdateGroupTableExitMem(client, uuid, req.session.gid);
    setTimeout(function() {
        res.redirect('/chat');
    }, 1*1000);
});

app.get('/delgrp', requireLogin, function(req, res) {
    const {Client} = require('pg');

    const client = new Client({
        connectionString: conStr
    });

    client.connect(function (err) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
    });

    var gid = req.session.gid;

    client.query('SELECT * FROM mygroups WHERE g_id=$1', [gid], function (err, resultgrp) {
        if (err) {
            return console.error('error running select query', err);
        }
        var members = resultgrp.rows[0].members;
        if (0 == members.length) return;
        for (var i = 0 ; i < members.length; i++) {
            UpdateUserExitGrp(client, members[i], gid);
            client.query('DELETE FROM localnotif_'+members[i]+' WHERE gid=$1',
                [gid], function (err, resultnotif) {
                    if (err) {
                        return console.error('error running select query', err);
                    }
            });
        }
        client.query('DELETE FROM notif WHERE gid=$1',
            [gid], function (err, resultnotif) {
                if (err) {
                    return console.error('error running select query', err);
                }
            });
        client.query('DELETE FROM mygroups WHERE g_id=$1', [gid], function (err, resultgrp) {
            if (err) {
                return console.error('error running select query', err);
            }
            res.redirect('/chat');
        });
    });
});

function InsertNotifications(client, frm_uuid, to_uuid, type, gid, frm_name){
    client.query('SELECT gname FROM mygroups WHERE g_id=$1', [gid], function (err, resultgrp) {
        if (err) {
            return console.error('error running select query', err);
        }
        if (0 == resultgrp.rows.length) return;
        var grpname = resultgrp.rows[0].gname;
        client.query('INSERT INTO notif (fr_uuid, to_uuid, type, gid, fr_name, gp_name)' +
            'VALUES ($1, $2, $3, $4, $5, $6) ',
            [frm_uuid, to_uuid, type, gid, frm_name, grpname], function (err, result) {
                if (err) {
                    return console.error('error running insert query', err);
                }
            });
    });
}

function UpdateUserGroups(client, uuid, gid) {
    client.query('SELECT * FROM localuser_'+uuid+' WHERE uuid=$1',
        [uuid], function (err, resultuser) {
        if (err) {
            return console.error('error running query for localuser_'+uuid, err);
        }
        if(0 == resultuser.rows.length) return;
        var mygids = resultuser.rows[0].my_gids;
        mygids.push(gid);
        client.query('UPDATE localuser_'+uuid+' SET my_gids=$1 WHERE uuid=$2',
            [mygids, uuid], function (err, result) {
                if (err) {
                    return console.error('error running insert query', err);
                }
            });
    });
}

function UpdateUserExitGrp(client, uuid, gid) {
    client.query('SELECT * FROM localuser_'+uuid+' WHERE uuid=$1',
        [uuid], function (err, resultuser) {
            if (err) {
                return console.error('error running query for localuser_'+uuid, err);
            }
            if(0 == resultuser.rows.length) return;
            var mygids = resultuser.rows[0].my_gids;
            for (var i = 0; i < mygids.length; i++) {
                if (gid == mygids[i]) {
                    mygids.splice(i, 1);
                    i--;
                }
            }
            client.query('UPDATE localuser_'+uuid+' SET my_gids=$1 WHERE uuid=$2',
                [mygids, uuid], function (err, result) {
                    if (err) {
                        return console.error('error running insert query', err);
                    }
                });
        });
}

function UpdateGroupTableExitMem(client, uuid, gid) {
    client.query('SELECT * FROM mygroups WHERE g_id=$1',
        [gid], function (err, resultgrp) {
            if (err) {
                return console.error('error running query for groups', err);
            }
            if(0 == resultgrp.rows.length) return;
            var members = resultgrp.rows[0].members;
            for (var i = 0; i < members.length; i++) {
                if (uuid == members[i]) {
                    members.splice(i, 1);
                    i--;
                }
            }
            client.query('UPDATE mygroups SET members=$1 WHERE g_id=$2',
                [members, gid], function (err, result) {
                    if (err) {
                        return console.error('error running insert query', err);
                    }
                });
        });
}

/********************************** Share ************************************/

app.get('/share', requireLogin, function(req, res){
    const { Client } = require('pg');

    const client = new Client({
        connectionString: conStr
    });

    client.connect(function (err) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
    });

    client.query('SELECT * FROM localuser_'+uuid+' WHERE uuid=$1',
        [req.session.user], function (err, resultlocal) {
            if (err) {
                return console.error('error running query for topics', err);
            }
            var groupList = [];
            client.query('SELECT g_id, gname FROM mygroups', function (err, resultgid) {
                if (err) {
                    return console.error('error running select query', err);
                }
                var gids = resultlocal.rows[0].my_gids;
                if (0 != gids.length) {
                    for (var i = 0; i < gids.length; i++) {
                        for (var j = 0; j < resultgid.rows.length; j++){
                            if (gids[i] == resultgid.rows[j].g_id) {
                                var data = {
                                    gid: resultgid.rows[j].g_id,
                                    gname: resultgid.rows[j].gname
                                };
                                groupList.push(data);
                            }
                        }
                    }
                }
                res.render('share', {groups:groupList});
            });
        });
});

/********************************** Questions ************************************/

app.get('/questions', requireLogin, function(req, res){
    res.render('questions');
});


/*********************************Courses+UserInterest*************************/
app.post('/query',function(req,res) {

    const {Client} = require('pg');

    const client = new Client({
        connectionString: conStr
    });
    client.connect(function (err) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
    });

    client.query('SELECT * FROM mygroups where t_id=$1', [req.body.searchinterest], function (err, resultgroups) {
        if (err) {
            return console.error('error running insert query', err);
        }
        function CheckMember(mem) {
            return mem == uuid;
        }
        for (var i = 0; i < resultgroups.rows.length; i++) {
            if (uuid == resultgroups.rows[i].members.find(CheckMember)) {
            //if (resultgroups.rows[i].members == uuid) {
                resultgroups.rows.splice(i, 1);
                i--;
            }
        }
        client.query('SELECT * FROM courses where t_name=$1',
            [req.body.searchinterest], function (err, resultcourses) {
                if (err) {
                    return console.error('error running insert query', err);
                }
                var interestedusers = [];
                var numusers = 0;
                client.query('SELECT * FROM users', function (err, resultusers) {
                    if (err) {
                        return console.error('error running query for username', err);
                    }
                    for (var x = 0; x < resultusers.rows.length; x++) {
                        if (resultusers.rows[x].uuid == uuid) {
                            continue;
                        }
                        client.query('SELECT * FROM localuser_' + resultusers.rows[x].uuid, function (err, result) {
                            if (err) {
                                return console.error('error running query for topics', err);
                            }
                            var i, j;

                            for (i = 0; i < result.rows.length; i++) {
                                if (!result.rows[i].t_ids) continue;
                                for (j = 0; j < result.rows[i].t_ids.length; j++) {
                                    if (req.body.searchinterest == result.rows[i].t_ids[j]) {
                                        var data = {
                                            uuid: result.rows[i].uuid,
                                            users: result.rows[i].uname
                                        };
                                        interestedusers.push(data);
                                    }
                                }
                            }
                            numusers++;
                            if (numusers == resultusers.rows.length - 1) {
                                var topic = [];
                                var data = {
                                    tid: req.body.searchinterest
                                };
                                topic.push(data);
                                res.render('searchresult', {
                                    topic: topic,
                                    userlocal: interestedusers,
                                    mygroups: resultgroups.rows,
                                    courses: resultcourses.rows
                                });
                            }
                        });
                    }
                });
        });
    });
});

app.post('/querycreategroup', requireLogin, function(req, res){
    const { Client } = require('pg');

    const client = new Client({
        connectionString: conStr
    });

    client.connect(function (err) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
    });

    var members = [];
    members.push(req.session.user);
    client.query('INSERT INTO mygroups(gname, t_id, admin, members) VALUES($1, $2 , $3, $4)',
        [req.body.gname, req.body.tid_gp, req.session.user, members], function (err, result) {
            if (err) {
                return console.error('error running insert query', err);
            }
            client.query('SELECT * FROM mygroups ORDER BY g_id DESC LIMIT 1', function (err, resultgid) {
                if (err) {
                    return console.error('error running select query', err);
                }
                UpdateUserGroups(client, req.session.user, resultgid.rows[0].g_id);
                client.query('SELECT * FROM localuser_'+uuid+' WHERE uuid=$1',
                    [req.session.user], function (err, resultuser) {
                        if (err) {
                            return console.error('error running query for localuser_'+uuid, err);
                        }
                        if(0 == resultuser.rows.length) return;
                        var frm_name = resultuser.rows[0].uname;
                        var gid = resultgid.rows[0].g_id;
                        var members = [];
                        if (req.body.memberselect instanceof Array) {
                            for (var i = 0; i < req.body.memberselect.length; i++) {
                                members.push(req.body.memberselect[i]);
                            }
                        } else {
                            members.push(req.body.memberselect);
                        }
                        if (0 == members.length){
                            return;
                        }
                        for (var i = 0; i < members.length; i++) {
                            InsertNotifications(client, req.session.user, members[i], "invite", gid, frm_name);
                        }
                        res.redirect('/chat');
                    });
            });
        });
});

/****************************************** Online chat ***************************************************/

app.post('/enterchat', function(req, res){
    req.session.gid = req.body.g_id;
    res.redirect('/chatPage');
});

app.get('/chatPage', function(req, res){
    const { Client } = require('pg');

    const client = new Client({
        connectionString: conStr
    });

    client.connect(function (err) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
    });

    client.query('SELECT * FROM users WHERE uuid=$1',
        [req.session.user], function (err, result) {
            if (err) {
                return console.error('error running query for username', err);
            }
            var groupid = [];
            var data = {
                gid: req.session.gid
            };
            groupid.push(data);
            client.query('SELECT * FROM mygroups WHERE g_id=$1',
                [req.session.gid], function (err, resultgid) {
                    if (err) {
                        return console.error('error running select query', err);
                    }
                    if (0 == resultgid.rows.length) return;
                    var exitstr = "Exit group";
                    var exittype = "exitgrp";
                    if (uuid == resultgid.rows[0].admin){
                        exitstr = "Delete group";
                        exittype = "delgrp";
                    }
                    var exitbtn = [];
                    var data = {
                        exitstr: exitstr,
                        exittype: exittype
                    };
                    exitbtn.push(data);
                    res.render('chatPage', {exit: exitbtn, userinfo: result.rows, group: groupid});
                });
        });
});

var usernames = [];
var chatgid = 0;

io.sockets.on('connection', function(socket){
    console.log('Socket Connected...');

    //for new user
    socket.on('new user', function(data, gid, callback){
        if(usernames.indexOf(data) != -1){
            callback(false);
        } else {
            callback(true);
            socket.username = data;
            socket.gid = gid;
            chatgid = gid;
            //usernames.push(socket.username);
            //updateUsernames();
            socket.join(gid);
            sendChatMsg(socket.gid, 'useradd', socket.username, 'meta');
        }
    });

    // Send Message
    socket.on('send message', function(data){
        //io.sockets.in(socket.gid).emit('new message', {msg: data, user:socket.username});
        sendChatMsg(socket.gid, data, socket.username, 'text');
    });

    // Disconnect
    socket.on('disconnect', function(data){
        if(!socket.username){
            return;
        }
        usernames = [];
        chatgid = 0;
        sendChatMsg(socket.gid, 'userdel', socket.username, 'meta');
        //usernames.splice(usernames.indexOf(socket.username), 1);
        //updateUsernames();
    });

});

// Update Usernames
function updateUsernames(message, id){
    if (chatgid != message.gid) return;
    if ('useradd' == message.msg) {
        if(usernames.indexOf(message.user) != -1){
            return;
        }
        if(message.user != globaluname){
            var data = {};
            data['msg'] = 'useradd';
            data['gid'] = message.gid;
            data['user'] = globaluname;
            data['type'] = 'meta';
            var strmsg = JSON.stringify(data);
            SendMessage(id, strmsg);
        }
        usernames.push(message.user);
    } else if ('userdel' == message.msg) {
        usernames.splice(usernames.indexOf(message.user), 1);
    }
    io.sockets.emit('usernames', usernames);
}

function sendChatMsg(gid, msg, username, type) {
    const { Client } = require('pg');
    const client = new Client({
        connectionString: conStr
    });
    client.connect(function (err) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
    });

    var data = {};
    data['msg'] = msg;
    data['gid'] = gid;
    data['user'] = globaluname;
    data['type'] = type;
    var strmsg = JSON.stringify(data);

    client.query('SELECT * FROM mygroups WHERE g_id=$1',
        [gid], function (err, resultgrp) {
            if (err) {
                return console.error('error running select mygroups query for chat', err);
            }
            if (0 == resultgrp.rows.length) return;
            var members = resultgrp.rows[0].members;
            for (var i = 0; i < members.length; i++) {
                //if (uuid != members[i]) continue;
                SendMessage(members[i], strmsg);
            }
        });
}

function SendMessage(to, msg) {
    ipc.connectTo(
        to.toString(),
        function(){
            //var ipctemp = ipc;
            ipc.of[to].on(
                'connect',
                function(){
                    ipc.of[to].emit(
                        'app.message',
                        {
                            id      : ipc.config.id,
                            message : msg
                        }
                    );
                    ipc.disconnect(to);
                }
            );
        });
}

/******************************** Notification *****************************/

app.get('/notif', requireLogin, function(req, res){
    const { Client } = require('pg');

    const client = new Client({
        connectionString: conStr
    });

    client.connect(function (err) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
    });

    client.query('INSERT INTO localnotif_'+uuid+' (id, fr_uuid, to_uuid, type, gid,fr_name, to_name, gp_name) ' +
        'SELECT id, fr_uuid, to_uuid, type, gid,fr_name, to_name, gp_name FROM notif WHERE to_uuid=$1',
        [req.session.user], function (err, result) {
        if (err) {
            return console.error('error running query for copying to local notif', err);
        }
        client.query('DELETE FROM notif WHERE to_uuid=$1', [req.session.user], function (err, result) {
            if (err) {
                return console.error('error running query for deleting from global notif', err);
            }
            client.query('SELECT * FROM localnotif_'+uuid, function (err, result) {
                if (err) {
                    return console.error('error running query for users', err);
                }
                var notiftxt = [];
                for (var i = 0; i < result.rows.length; i++) {
                    var msg;
                    if (result.rows[i].type == 'invite') {
                        msg = "Invitation to join group " + result.rows[i].gp_name + " from " + result.rows[i].fr_name;
                    } else if (result.rows[i].type == 'reqjoin') {
                        msg = "Request to join group " + result.rows[i].gp_name + " from " + result.rows[i].fr_name;
                    }
                    var data = {
                        notif_id: result.rows[i].id,
                        notif_txt: msg
                    };
                    notiftxt.push(data);
                }
                res.render('notif', {notifs: notiftxt});
            });
        });
    });
});

app.post('/notifbtn', function(req, res) {
    const {Client} = require('pg');

    const client = new Client({
        connectionString: conStr
    });

    client.connect(function (err) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
    });

    var str = req.body.event;
    var event = str.match(/^[a-z]+/);
    var notifid = str.match(/\d+$/);

    if ("accept" == event[0]) {
        client.query('SELECT * FROM localnotif_'+uuid+' WHERE id=$1',
            [notifid[0]], function (err, resultnotif) {
                if (err) {
                    return console.error('error running query for groups', err);
                }
                if (0 == resultnotif.rows.length) return;
                if ("invite" == resultnotif.rows[0].type) {
                    UpdateGroupTable(client, resultnotif.rows[0].to_uuid, resultnotif.rows[0].gid);
                    UpdateUserGroups(client, resultnotif.rows[0].to_uuid, resultnotif.rows[0].gid);
                } else if ("reqjoin" == resultnotif.rows[0].type) {
                    UpdateGroupTable(client, resultnotif.rows[0].fr_uuid, resultnotif.rows[0].gid);
                    UpdateUserGroups(client, resultnotif.rows[0].fr_uuid, resultnotif.rows[0].gid);
                }
                RemoveNotif(client, notifid, res);
            });
    }
    else {
        RemoveNotif(client, notifid, res);
    }
});

function RemoveNotif(client, id, res) {
    client.query('DELETE FROM localnotif_'+uuid+' WHERE id=$1',
        [parseInt(id)], function (err, resultnotif) {
            if (err) {
                return console.error('error running query for groups', err);
            }
            res.redirect('/notif');
        });
}

function UpdateGroupTable(client, uuid, gid) {
    client.query('SELECT * FROM mygroups WHERE g_id=$1',
        [gid], function (err, resultgrp) {
            if (err) {
                return console.error('error running query for groups', err);
            }
            if(0 == resultgrp.rows.length) return;
            var members = resultgrp.rows[0].members;
            members.push(uuid);
            client.query('UPDATE mygroups SET members=$1 WHERE g_id=$2',
                [members, gid], function (err, result) {
                    if (err) {
                        return console.error('error running insert query', err);
                    }
                });
        });
}