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

// check for link, we are using node module for link commands
var cmd = argv._.splice(0, 1)[0];
if( cmd === 'link' ) {
  cmd = 'node';
  argv.link = true;
}

// load config file
require('./lib/fileConfig')(argv);

// check for show pd, ts or ev
if( cmd === 'pd' || cmd === 'ts' || cmd === 'ev' ) {
  var type = cmd;
  if( argv._.length === 0 ) {
    console.log('You need to supply a command for the '+type+' module. options: [list | show | add]');
    process.exit(-1);
  }

  var cmd = argv._.splice(0, 1)[0];
  if( cmd === 'show' ) {
    return require('./cmds/showBuild')(type, argv);
  } else {
    console.log('Invalid command for '+type+': '+cmd);
    process.exit(-1);
  }
}

var modulePath = path.join(__dirname, 'cmds', cmd+'.js');

if( !fs.existsSync(modulePath) ) {
  return console.log('Invalid command: '+cmd);
}

require(modulePath)(argv);
