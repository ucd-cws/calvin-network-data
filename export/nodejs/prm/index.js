'use strict';

var argv = require('minimist')(process.argv.slice(2));
var crawler = require('../crawler');

// test crawl a repo
if( argv.crawl ) {
  crawler(argv.crawl, function(result){
    console.log('*********');
    console.log('Regions: '+result.regions.length);
    console.log('Nodes/Links: '+result.nodes.length);
    console.log('done.');
  });
}
