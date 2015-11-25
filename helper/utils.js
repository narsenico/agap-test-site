/* helper: utils */
var l = require('./logger');
var md5 = require('crypto-md5');
var _ = require('lodash');

var ERROR_CODES = {
    ERR_USER_ALREADY_PRESENT: -1001,
    ERR_USER_OR_PASSWORD_NOT_VALID: -1002
};

function newError(code, message) {
    var error = new Error(message);
    error.code = code;
    return error;
}

function encrypt(message) {
    return md5(message);
}

function sendHttpError(res, httpCode, err) {
	var msg = (_.isObject(err) ? err.message : err) || '';
	l.error(httpCode, msg);
    res.status(httpCode).send(msg);
}

// TODO: rivedere risposte standard rest
// vedi http://apigee.com/about/blog/technology/restful-api-design-what-about-errors

function sendRestOk(res, data) {
	res.json({ resp: 'ok', data: data });
}

function sendRestErr(res, code, msg, data) {
	res.json({ resp: 'err', code: code, msg: msg, data: data });	
}

function checkSession(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.sendStatus(403);
    }
}

//
exports.ERROR_CODES = ERROR_CODES;
exports.newError = newError;
exports.encrypt = encrypt;
exports.sendHttpError = sendHttpError;
exports.sendRestOk = sendRestOk;
exports.sendRestErr = sendRestErr;
exports.checkSession = checkSession;
