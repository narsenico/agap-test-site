/* helper: logger */
var chalk = require('chalk');
//
var LEVEL_DEBUG = 4;
var LEVEL_INFO = 3;
var LEVEL_WARN = 2;
var LEVEL_ERROR = 1;
var LEVEL_NONE = 0;
//
var LOGLEVEL = 4;

function debug() {
    if (LOGLEVEL >= LEVEL_DEBUG)
        console.log(chalk.green.apply(chalk.greep, arguments));
}

function info() {
	if (LOGLEVEL >= LEVEL_INFO)
    	console.log(chalk.yellow.apply(chalk.greep, arguments));
}

function warn() {
	if (LOGLEVEL >= LEVEL_WARN)
    	console.log(chalk.magenta.apply(chalk.greep, arguments));
}

function error() {
	if (LOGLEVEL >= LEVEL_ERROR)
    	console.log(chalk.red.apply(chalk.greep, arguments));
}

//
exports.d = 
exports.debug = 
exports.log = debug;
exports.i = 
exports.info = info;
exports.w =
exports.warn = warn;
exports.e =
exports.err =
exports.error = error;
