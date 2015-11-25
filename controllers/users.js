/* controller: users */
var l = require('../helper/logger');
var db = require('../models/db-mongo-imp');
var utils = require('../helper/utils');
var express = require('express');
var router = express.Router();

// GET /users -> tutti gli utenti
// GET /users/:uid -> utente
// GET /users/__current -> utente sessione
// POST /users (uid,pwd,profile) -> nuovo utente
// POST /users/:uid (pwd,profile) -> modifica utente
// DELETE /users/:uid -> rimuovi utente

//
router.get(['', '/:uid'], utils.checkSession, function(req, res) {
    // recupero da sessione
    if (!req.params.uid) {
        db.getUsers(function(err, users) {
            if (err) return utils.sendHttpError(res, 500, err);
            res.send(JSON.stringify(users));
        });
    } else if (req.params.uid == '__current') {
        res.json(req.session.user);
    } else {
        db.getUser(req.params.uid, function(err, users) {
            if (err) return utils.sendHttpError(res, 500, err);
            res.send(JSON.stringify(users));
        });
    }
});

// aggiunge o modifca utente
router.post(['', '/:uid'], utils.checkSession, function(req, res) {
    if (req.params.uid) {
        // TODO: modifica utente
        l.debug('edit', req.params.uid);
        res.json(null);
    } else {
        db.addUser(req.body.uid, req.body.pwd, req.body.profile, function(err, user) {
            if (err) return utils.sendHttpError(res, 500, err);
            res.json(user);
        });
    }
});

//
module.exports = router;
