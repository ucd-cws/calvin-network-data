'use strict';

var writelib = require('./writelib');
var writeNode = require('./writeNode');

module.exports = function(nodes) {
  var outputtext = '', i, node;

  outputtext += '..        ***** NODE DEFINITIONS *****\n';
  outputtext += writelib.END_gen();

  for(i = 0; i < nodes.length; i++) {
    node = nodes[i];

    if( node.properties.type !== 'Diversion' && node.properties.type !== 'Return Flow'  ) {
      outputtext += writeNode(node);
    }
  }

  return outputtext;
};
