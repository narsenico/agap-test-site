// implementazione per mongodb
var assert = require('assert');
var _ = require('lodash');
var l = require('../helper/logger');
var utils = require('../helper/utils');
var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

// TODO: uid deve essere univoco

//
var userSchema = new Schema({
    uid: String,
    pwd: String,
    profile: Number
});
userSchema.pre('save', function(next) {
    l.debug('save user', this.get('uid'));
    next();
});
var User = mongoose.model('User', userSchema);
//
var url = 'mongodb://localhost:27017/test';
//
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
    mongoose.connection.on('open', function() {
        l.info('mongodb connected on', url);
        //se non esiste admin lo creo
        User.find({
            uid: 'admin'
        }, function(err, res) {
            if (err) return cb(err);
            if (res.length === 0) {
                var user = new User();
                user.uid = 'admin';
                user.pwd = utils.encrypt('admin');
                user.profile = PROFILES.ADMINISTRATOR;
                user.save(function(err) {
                    cb(err);
                });
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
        if (err) return cb(err);
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
            return _.pick(user, ['uid', 'profile']);
        }));
    });
}

// cb(err, user)
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
exports.RESP_CODES = RESP_CODES;
exports.PROFILES = PROFILES;
exports.init = init;
exports.addUser = addUser;
exports.getUser = getUser;
exports.getUsers = getUsers;
exports.authenticate = authenticate;
