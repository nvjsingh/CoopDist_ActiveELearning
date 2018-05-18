var express = require('express'),
    path = require('path'),
    bp = require('body-parser'),
    cons = require('consolidate'),
    dust = require('dustjs-helpers'),
    pg = require('pg'),
    sessions = require('client-sessions'),
    app = express(),
    server = require('http').createServer(app);

var port = 3772;
var indexstr = 'http://localhost:3773/';

server.listen(port, function(){
    console.log('Institution service started on port ' + port);
});

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

//----------------------- Sign in ------------------------//

function requireInstituteLogin (req, res, next) {
    if (!req.session || !req.session.user) {
        res.redirect('indexstr');
    } else if (req.session.user != "institute") {
        res.redirect('indexstr');
    } else {
        next();
    }
}

app.get('/', function(req, res){
    req.session.user = "institute";
    res.redirect('/inst');
});

app.get('/inst', function(req, res){
    res.render('institution');
});

app.post('/addinst', function(req, res){
    const { Client } = require('pg');

    const client = new Client({
        connectionString: conStr
    });

    client.connect(function (err) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
    });

    client.query('INSERT INTO courses(i_name,c_name,t_name,c_url) VALUES($1,$2,$3,$4)',
        [req.body.instname,req.body.cname,req.body.tname,req.body.url], function (err, result) {
            if (err) {
                return console.error('error running insert query', err);
            }

            res.render('institution');


        });
});

function CloseServer(res) {
    console.log('Closing server on ' + port);
    if (null != res) {
        res.end();
    }
    server.close();
    process.exit();
}

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