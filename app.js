var assert = require('assert');
var chalk = require('chalk');
var l = require('./helper/logger');
var utils = require('./helper/utils');
var db = require('./models/db-mongo-imp');
var bodyParser = require('body-parser'); // grazie a questo middleware viene popolato req.body
var session = require('express-session');
var express = require('express');
var app = express();

var PORT = 3000;
var SESSION_TIMEOUT = 3600000; // 1h

// inizializzo il database
db.init(function(err) {
    //
    assert.equal(err, null);
    // per gestire le sessioni
    app.use(session({
        secret: 'agap',
        cookie: {
            maxAge: SESSION_TIMEOUT
        }
    }));
    // log di tutte le richieste
    app.use(function log(req, res, next) {
        l.debug('==>', req.session.id, req.method, req.ip, req.originalUrl);
        next();
    });
    // parsing application/json
    app.use(bodyParser.json());
    // parsing application/x-www-form-urlencoded    
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    // NB per gestire il controllo della sessione aggiungere utils.checkSession come prima callback
    //  es: router.get('/ttt', utils.checkSession, function(req, res) { ... })
    // file statici
    app.use(express.static(__dirname + '/public'));
    // risponde alla root 
    app.use('/', require('./controllers/main'));
    // risponde a /users/xxx
    app.use('/users', require('./controllers/users'));
    // TODO: altri router
    l.debug('start http listener on port', PORT);
    app.listen(PORT, function() {
        l.info('listening on port', PORT);
    });
});
