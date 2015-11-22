/*
Come prima cosa chiamare init() per inizializzare il database (creazione database, struttura dati, utente admin, etc)
*/

var assert = require('assert');
var l = require('../helper/logger.js');
var utils = require('../helper/utils');
var fs = require('fs');
var _ = require('lodash');
var sqlite3 = require('sqlite3').verbose();
var db;
//
var DATA_FOLDER = './data';
var OBJ_USER = {
    uid: null,
    profile: 0
};
//
var RESP_CODES = {
    ERR_USER_ALREADY_PRESENT: -1001
};
//
var PROFILES = {
    ADMINISTRATOR: 65535
};

// cb(err)
function init(cb) {
    // creo la cartella data se non esiste
    if (!fs.existsSync(DATA_FOLDER)) {
        l.debug('creating folder ', DATA_FOLDER);
        fs.mkdirSync(DATA_FOLDER);
    }

    db = new sqlite3.Database(DATA_FOLDER + '/agap.sqlite3', function(err) {
        if (err) {
            cb(err);
        } else {
            l.debug('database opened successfully');
            // TODO: creare struttura dati
            db.run('CREATE TABLE IF NOT EXISTS tUsers ( uid TEXT PRIMARY KEY, pwd TEXT, profile INT )', function(err) {
                if (err) {
                    cb(err);
                } else {
                    l.debug('tUsers created');
                    // se non esiste l'utente admin lo creo
                    addUser({
                        uid: 'admin',
                        pwd: 'admin',
                        profile: PROFILES.ADMINISTRATOR
                    }, function(err) {
                        if (!err || err.code === RESP_CODES.ERR_USER_ALREADY_PRESENT) {
                            cb();
                        } else {
                            cb(err);
                        }
                    });
                }
            });
        }
    });
} //end init

// cb(err, user)
function addUser(user, cb) {
    assert.notEqual(db, null);
    assert.notEqual(user, null);

    db.get('SELECT uid FROM tUsers WHERE uid = $uid', {
        $uid: user.uid
    }, function(err, row) {
        if (err) return cb(err);
        if (row !== undefined) return cb(utils.newError(RESP_CODES.ERR_USER_ALREADY_PRESENT, 'User already present'));
        
        db.run('INSERT INTO tUsers (uid, pwd, profile) VALUES ($uid, $pwd, $profile)', {
            $uid: user.uid,
            $pwd: utils.encrypt(user.pwd),
            $profile: user.profile
        }, function(err) {
            assert.equal(err, null);
            l.debug(user.uid, 'created');
            cb(null, user);
        });
    });
} //end addUser

// cb(err, users[])
function getUsers(cb) {
    assert.notEqual(db, null);

    db.all('SELECT uid, profile FROM tUsers', function(err, rows) {
        if (err) return cb(err);
        
        var users = [];
        rows.forEach(function(row) {
            users.push(_.extend({}, OBJ_USER, {
                uid: row.uid,
                profile: row.profile
            }));
        });
        cb(null, users);
    });
}

// cb(err, user)
function authenticate(uid, pwd, cb) {
    assert.notEqual(db, null);
    // TODO: autenticazione
    db.get('SELECT uid, pwd, profile FROM tUsers WHERE uid = $uid', {
        $uid: uid
    }, function(err, row) {
    	if (err) return cb(err);
    	if (!row) return cb();

    	if (row.pwd === utils.encrypt(pwd)) {
    		cb(null, { uid: row.uid, profile: row.profile });
    	} else {
    		cb();
    	}
    });
}

//
exports.RESP_CODES = RESP_CODES;
exports.PROFILES = PROFILES;
exports.init = init;
exports.addUser = addUser;
exports.getUsers = getUsers;
exports.authenticate = authenticate;
