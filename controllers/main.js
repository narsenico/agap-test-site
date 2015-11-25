/* controller: main */
var assert = require('assert');
var l = require('../helper/logger');
var db = require('../models/db-mongo-imp');
var utils = require('../helper/utils');
var express = require('express');
var router = express.Router();

// test
router.get('/test', function(req, res) {
	res.sendStatus(200);
});

// login utente
router.post('/login', function(req, res) {
    // verifico uid/pwd e crea session.user
    db.authenticate(req.body.uid, req.body.pwd, function(err, user) {
        if (err) return utils.sendHttpError(res, 500, err);
        if (!user) {
            res.json(null);
        } else {
            req.session.user = user;
            res.json(user);
        }
    });
});

// logout
router.get('/logout', function(req, res) {
    req.session.destroy(function(err) {
        assert.equal(err, null);
        res.redirect('/');
    });
});

//
module.exports = router;
