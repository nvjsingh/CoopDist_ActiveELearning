var express = require('express'),
    path = require('path'),
    bp = require('body-parser'),
    cons = require('consolidate'),
    dust = require('dustjs-helpers'),
    pg = require('pg'),
    sessions = require('client-sessions'),
    app = express(),
    server = require('http').createServer(app),
    userso = require('./userso');

var port = 3773;
var instport = 3772;
var baseurl = 'http://localhost:';
var indexstr = 'http://localhost:3773/';

var userSos = {
};

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

SystemInit();

server.listen(port, function(){
    console.log('Server started on port ' + port);
});

/************************ Global functions ****************/


/************************ Initialization ******************/

function SystemInit() {
    const { Client } = require('pg');

    const client = new Client({
        connectionString: conStr
    });

    client.connect(function (err) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
    });

    client.query('SELECT * FROM users', function (err, result) {
        if (err) {
            return console.error('error running query for users', err);
        }
        for (var i = 0; i < result.rows.length; i++){
            var obj = new userso(result.rows[i].uuid, 'http://localhost:', null, "postgres://mypls:11@localhost/myplsdb", "postgres://mypls:11@localhost/myplsdb");
            userSos[result.rows[i].uuid] = obj;
        }
    });
}

app.get('/', function(req, res){
    res.redirect('/login');
});

app.get('/login', function(req, res){
    res.render('index');
});

//----------------------- Sign in ------------------------//

function requireAdminLogin (req, res, next) {
    if (!req.session || !req.session.user) {
        res.redirect('/login');
    } else if (req.session.user != "admin") {
        res.redirect('/login');
    } else {
        next();
    }
}

function StartNewService(so) {
    if (null == so.psPort) {
        port++;
        so.psPort = port;
    }
    var cp = require('child_process');
    var arg = Object.create(process.env);
    arg.execArgv = [so.psPort, so.uuid];
    var filepath = __dirname + '/app.js';

    var n = cp.fork(filepath, arg.execArgv);
}

function StartInstituteService() {
    var cp = require('child_process');
    var arg = Object.create(process.env);
    arg.execArgv = [instport];
    var filepath = __dirname + '/institution.js';

    var n = cp.fork(filepath, arg.execArgv);
}

app.post('/signin', function(req, res){
    var loginid = req.body.loginid;
    if (loginid == "admin") {
        req.session.user = loginid;
        res.redirect('/admin');
        return;
    } else if (loginid == "institute") {
        req.session.user = loginid;
        StartInstituteService();
        res.redirect(baseurl + instport + '/');
        return;
    }
    const { Client } = require('pg');

    const client = new Client({
        connectionString: conStr
    });

    client.connect(function (err) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
    });

    client.query('SELECT uname FROM users WHERE uuid=$1',
        [loginid], function (err, result) {
            if (err) {
                return console.error('error running select login', err);
            }
            if (result.rowCount == 0) {
                return;
            }
            var so = userSos[loginid];
            StartNewService(so);
            res.redirect(so.psUrl + so.psPort + '/');
        });
});

app.get('/logout', function(req, res) {
    req.session.reset();
    res.redirect(indexstr);
});

app.get('/user', function(req, res) {
    res.redirect('/admin');
});

app.get('/chat', function(req, res) {
    res.redirect('/admin');
});

app.get('/share', function(req, res) {
    res.redirect('/admin');
});

app.get('/questions', function(req, res) {
    res.redirect('/admin');
});

app.get('/notif', function(req, res) {
    res.redirect('/admin');
});

app.get('/admin', requireAdminLogin, function(req, res){
    req.session.user = "admin";
    const { Client } = require('pg');

    const client = new Client({
        connectionString: conStr
    });

    client.connect(function (err) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
    });

    client.query('SELECT * FROM users', function (err, result) {
        if (err) {
            return console.error('error running query for users', err);
        }
        client.query('SELECT * FROM topics', function (err, restopics) {
            if (err) {
                return console.error('error running query for topics', err);
            }
            res.render('admin', {users: result.rows, topics:restopics.rows});
        });
    });
});


app.post('/add', function(req, res){
    const { Client } = require('pg');

    const client = new Client({
        connectionString: conStr
    });

    var addedUser;

    client.connect(function (err) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
    });

    client.query('INSERT INTO users(uname) VALUES($1)',
        [req.body.uname], function (err, result) {
            if (err) {
                return console.error('error running insert query', err);
            }
            client.query('SELECT * FROM users ORDER BY uuid DESC LIMIT 1', function (err, resultuser) {
                if (err) {
                    return console.error('error running insert query', err);
                }
                if (0 == resultuser.rows.length) {
                    return;
                }
                var uuid = resultuser.rows[0].uuid;
                var selTopics = [];
                var obj = new userso(uuid, 'http://localhost:', null, "postgres://mypls:11@localhost/myplsdb", "postgres://mypls:11@localhost/myplsdb");
                userSos[result.rows[i].uuid] = obj;
                if (req.body.seltopic instanceof Array) {
                    for (var i = 0; i < req.body.seltopic.length; i++) {
                        selTopics.push(req.body.seltopic[i]);
                    }
                } else {
                    selTopics.push(req.body.seltopic);
                }
                //----------------creating localuser table for each SO ---------------------------
                client.query("CREATE TABLE localuser_"+uuid+"(uuid SERIAL PRIMARY KEY, t_ids TEXT[], my_gids INTEGER[] , uname TEXT )", function (err, result) {
                    if (err) {
                        return console.error('error ceratin table localuser', err);
                    }

                    client.query("INSERT INTO localuser_"+uuid+"(uuid, t_ids, my_gids, uname) VALUES($1, $2, $3, $4)",
                        [uuid, selTopics, [], req.body.uname], function (err, result) {
                            if (err) {
                                return console.error('error running insert localuser', err);
                            }
                        });

                });
                //-------------------creating local notification table for each SO ---------------
                client.query("CREATE TABLE localnotif_" +uuid+ "(fr_uuid INTEGER, to_uuid INTEGER, type TEXT , id SERIAL PRIMARY KEY ," +
                    "gid INTEGER ,fr_name TEXT , to_name TEXT , gp_name TEXT)", function (err, result) {
                    if (err) {
                        return console.error('error ceratin notification table', err);
                    }
                    res.redirect('admin');
                });
            });
        });
});

/*********************************delete*************************************/
app.delete('/delete/:uuid', function(req, res){
    const { Client } = require('pg');

    const client = new Client({
        connectionString: conStr
    });

    client.connect(function (err) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
    });

    client.query('DELETE FROM users WHERE uuid=$1',
        [req.params.uuid], function (err) {
            if (err) {
                return console.error('error running query to delete user', err);
            }
            client.query('DELETE FROM localuser_'+uuid+' WHERE uuid=$1',
                [req.params.uuid], function (err) {
                    if (err) {
                        return console.error('error running query to delete localuser_'+uuid, err);
                    }
                });
            res.sendStatus(200);
        });
});