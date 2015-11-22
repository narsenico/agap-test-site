var assert = require('assert');
var chalk = require('chalk');
var l = require('./helper/logger');
var utils = require('./helper/utils');
var db = require('./models/db');
var bodyParser = require('body-parser'); // grazie a questo middleware viene popolato req.body
var session = require('express-session');
var express = require('express');
var app = express();

var PORT = 3000;
var SESSION_TIMEOUT = 3600000; // 1h

// inizializzo il database
db.init(function() {
    // per gestire le sessioni
    app.use(session({
        secret: 'agap',
        cookie: {
            maxAge: SESSION_TIMEOUT
        }
    }));
    //
    app.use(function log(req, res, next) {
        l.debug('==>', req.session.id, req.method, req.ip, req.originalUrl);
        //console.dir(req);
        next();
    });
    // controllo della sessione
    app.use(function checkSession(req, res, next) {
    	// TODO: se file statico -> redirect index
    	// TODO: se /users/auth -> sempre ok
    	// TODO: se user non in sessione -> 403  

    	if (req.session.user) {
    		next();
    	} else {
    		utils.sendHttpError(res, 403);
    	}
    });
    // for parsing application/json
    app.use(bodyParser.json());
    // for parsing application/x-www-form-urlencoded	
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    // file statici
    app.use(express.static(__dirname + '/public'));
    // risponde a GET users/xxx
    app.use('/users', require('./controllers/users'));
    // TODO: altri router

    l.debug('start http listener on port', PORT);
    app.listen(PORT, function() {
        l.info('listening on port', PORT);
    });
});
