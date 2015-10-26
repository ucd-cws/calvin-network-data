'use strict';

var crawler = require('../../crawler');

module.exports = function(argv) {
  if( argv._.length === 0 ) {
    console.log('No path provided');
    process.exit(-1);
  }

  crawler(argv._[0], function(result){
    console.log('*********');
    console.log('Regions: '+result.regions.length);
    console.log('Nodes/Links: '+result.nodes.length);
    console.log('done.');
  });
};
