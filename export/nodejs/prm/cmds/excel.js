'use strict';

var crawler = require('../../crawler');
var excel = require('../../excel');

module.exports = function(argv) {
  if( !argv.data ) {
    console.log('No path provided');
    process.exit(-1);
  }

  if( !argv.x ) {
    console.log('No excel provided');
    process.exit(-1);
  }

  excel(argv);

  /*crawler(argv._[0], function(result){

  });*/
};
