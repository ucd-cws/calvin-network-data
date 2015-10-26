'use strict';

var writelib = require('./writelib');
var writeLink = require('./writeLink');

module.exports = function(nodes) {
  var outputtext = '';

  var i, node;

  for(i = 0; i < nodes.length; i++) {
    node = nodes[i];

    if( node.properties.type !== 'Diversion' && node.properties.type !== 'Return Flow'  ) {
      continue;
    }

    writeLink(node);
  }

  return outputtext;
};
