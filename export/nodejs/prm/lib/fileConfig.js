'use strict';

var fs = require('fs');
var path = require('path');
var CONFIG_NAME = '.prmconf';

/**
 * Store basic calvin prm in home directory
 **/
module.exports = function(argv) {
  if( argv.c || argv.config ) {
    readConfig(argv.c || argv.config, argv);
    return;
  }

  var configPath = path.join(getUserHome(), CONFIG_NAME);

  if( fs.existsSync(configPath) ) {
    readConfig(configPath, argv);
  }
};

function readConfig(path, argv) {
  if( !fs.existsSync(path) ) {
    console.log('Invalid config file path: '+path);
    process.exit(-1);
  }

  var config;
  try {
    config = JSON.parse(fs.readFileSync(path, 'utf-8'));
  } catch(e) {
    console.log('Failed to import config: '+path);
    console.log(e);
    process.exit(-1);
  }

  for( var key in config ) {
    argv[key] = config[key];
  }
}

function getUserHome() {
  return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
}
