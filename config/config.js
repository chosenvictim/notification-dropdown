var nconf = require('nconf');

module.exports = nconf.argv().env().file({ file: __dirname + '/config.json' });
