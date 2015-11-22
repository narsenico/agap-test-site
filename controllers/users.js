/* controller: users */
var l = require('../helper/logger');
var db = require('../models/db');
var express = require('express');
var router = express.Router();

// login utente
router.post('/auth', function(req, res) {
	// verifico uid/pwd e crea session.user
	db.authenticate(req.body.uid, req.body.pwd, function(err, user) {
		if (err) return utils.sendHttpError(res, 500, err);
		if (!user) {
			res.json({ user: null });
		} else {
			req.session.user = user;
			res.json({ user: user });
		}
	});
});

// info utente
router.get('/info', function(req, res) {
    // TODO: recuperare uid da cookie sessione
    res.send('info');
});

// elenco di tutti gli utenti
router.get('/all', function(req, res) {
    db.getUsers(function(err, users) {
        if (err) {
            res.send('error'); // TODO: rispondere con 500
        } else {
        	// TODO: mappare users in {uid,profile}
            res.send(JSON.stringify(users));
        }
    });
});

//
module.exports = router;
