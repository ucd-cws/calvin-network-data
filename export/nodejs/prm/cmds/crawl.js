'use strict';

var crawler = require('../../crawler');

module.exports = function(dir) {
  crawler(dir, function(result){
    console.log('*********');
    console.log('Regions: '+result.regions.length);
    console.log('Nodes/Links: '+result.nodes.length);
    console.log('done.');
  });
};
