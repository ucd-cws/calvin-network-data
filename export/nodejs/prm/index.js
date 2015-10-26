'use strict';

var fs = require('fs');
var path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var crawler = require('../crawler');


var noCommand = false;
if( !argv._ ) {
  noCommand = true;
} else if ( argv._.length === 0 ) {
  noCommand = true;
}
if( noCommand ) {
  return console.log('Please provide a command.');
}

var cmd = argv._.splice(0, 1)[0];
if( cmd === 'link' ) {
  cmd = 'node';
  argv.link = true;
}

var modulePath = path.join(__dirname, 'cmds', cmd+'.js');

if( !fs.existsSync(modulePath) ) {
  return console.log('Invalid command: '+cmd);
}

require('./lib/fileConfig')(argv);
require(modulePath)(argv);
