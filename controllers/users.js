/* controller: users */
var l = require('../helper/logger');
var db = require('../models/db-mongo-imp');
var express = require('express');
var router = express.Router();

// login utente
router.post('/auth', function(req, res) {
    // verifico uid/pwd e crea session.user
    db.authenticate(req.body.uid, req.body.pwd, function(err, user) {
        if (err) return utils.sendHttpError(res, 500, err);
        if (!user) {
            res.json({
                user: null
            });
        } else {
            req.session.user = user;
            res.json({
                user: user
            });
        }
    });
});

// aggiunge utente
router.get('/add/:uid', function(req, res) {
	console.log(req.params.uid);
	res.send('ok');
});

// info utente
router.get('/info', function(req, res) {
    // recupero da sessione
    res.send(JSON.stringify(req.session.user));
});

// elenco di tutti gli utenti
router.get('/all', function(req, res) {
    db.getUsers(function(err, users) {
        if (err) return utils.sendHttpError(res, 500, err);
        res.send(JSON.stringify(users));
    });
});

//
module.exports = router;
