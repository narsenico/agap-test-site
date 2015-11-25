// implementazione per mongodb
var assert = require('assert');
var _ = require('lodash');
var l = require('../helper/logger');
var utils = require('../helper/utils');
var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

//
var User = mongoose.model('User', new Schema({
    uid: { type: String, index: { unique: true } },
    pwd: { type: String, required: true },
    profile: Number
}));
User.on('index', function(err) {
    if (err) console.error(err);
});

//
var url = 'mongodb://localhost:27017/test';
//
var OBJ_USER = {
    uid: null,
    profile: 0
};
//
var PROFILES = {
    ADMINISTRATOR: 65535
};

// cb(err)
function init(cb) {
    mongoose.connection.on('open', function() {
        l.info('mongodb connected on', url);
        //se non esiste admin lo creo
        User.find({
            uid: 'admin'
        }, function(err, res) {
            if (err) return cb(err);
            if (res.length === 0) {
                addUser('admin', 'admin', PROFILES.ADMINISTRATOR, cb);
            } else {
                cb();
            }
        });
    });
    //
    mongoose.connect(url);
} //end init

// cb(err, user)
function addUser(uid, pwd, profile, cb) {
    assert.notEqual(uid, null);
    assert.notEqual(pwd, null);
    new User({
        uid: uid,
        pwd: utils.encrypt(pwd),
        profile: profile || 0
    }).save(function(err) {
        if (err) {
            if (11000 === err.code || 11001 === err.code) {
                return cb(utils.newError(utils.ERROR_CODES.ERR_USER_ALREADY_PRESENT, "User already present"));
            } else {
                return cb(err);
            }
        }
        cb(null, { uid: uid, profile: profile });
    });
}

// cb(err, user)
function getUser(uid, cb) {
    User.findOne({
        uid: uid
    }, 'pwd profile', function(err, res) {
        if (err) return cb(err);
        if (!res) return cb();
        cb(null, {
            uid: uid,
            profile: res.profile
        });
    });
}

// cb(err, users[])
function getUsers(cb) {
    User.find({}, function(err, res) {
        if (err) return cb(err);
        cb(null, _.map(res, function(user) {
            //estraggo solo uid e profile
            return _.pick(user, ['uid', 'profile']);
        }));
    });
}

// cb(err, user)
// cb(null, user) -> ok
// cd() -> no auth
function authenticate(uid, pwd, cb) {
    User.findOne({
        uid: uid
    }, 'pwd profile', function(err, res) {
        if (err) return cb(err);
        if (!res) return cb();
        if (res.pwd === utils.encrypt(pwd)) {
            cb(null, {
                uid: uid,
                profile: res.profile
            });
        } else {
            cb();
        }
    });
}

//
exports.PROFILES = PROFILES;
exports.init = init;
exports.addUser = addUser;
exports.getUser = getUser;
exports.getUsers = getUsers;
exports.authenticate = authenticate;
