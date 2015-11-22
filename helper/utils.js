/* helper: utils */
var md5 = require('crypto-md5');
var _ = require('lodash');
var HTTP_STATUS_MESSAGE = {
    403: 'Forbidden'
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
    res.status(httpCode).send(_.isObject(err) ? err.message : err || HTTP_STATUS_MESSAGE[httpCode] || '');
};

//
exports.newError = newError;
exports.encrypt = encrypt;
exports.sendHttpError = sendHttpError;
