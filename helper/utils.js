/* helper: utils */
var l = require('./logger');
var md5 = require('crypto-md5');
var _ = require('lodash');

function newError(code, message) {
    var error = new Error(message);
    error.code = code;
    return error;
}

function encrypt(message) {
    return md5(message);
}

function sendHttpError(res, httpCode, err) {
	l.error(httpCode, _.isObject(err) ? err.message : err || '');
    res.sendStatus(httpCode);
};

function checkSession(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.sendStatus(403);
    }
}

//
exports.newError = newError;
exports.encrypt = encrypt;
exports.sendHttpError = sendHttpError;
exports.checkSession = checkSession;
