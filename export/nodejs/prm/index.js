'use strict';

var argv = require('minimist')(process.argv.slice(2));
var crawler = require('../crawler');




// test crawl a repo
if( argv.crawl ) {
  require('./cmds/crawler')(argv.crawl);
} else if( argv.build ) {
  require('./cmds/build')(argv);
}
