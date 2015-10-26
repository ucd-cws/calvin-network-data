'use strict';

var writelib = require('./writelib');
var writeInflow = require('./writeInfo');

module.exports = function(nodes) {
  var outputtext = '';

  // outputtext += '..         \n';
  // outputtext += '..         \n';
  // outputtext += '..         \n';
  // outputtext += 'LINK      DIVR      SOURCE    SINK      1.000     0.00\n';
  // outputtext += 'LD        Continuity Link\n';
  // outputtext += '..         \n';
  outputtext += '..        ***** INFLOW DEFINITIONS *****\n';
  outputtext += writelib.END_gen();

  var node, i, partF, LD;

  for(i = 0; i < nodes.length; i++) {
    node = nodes[i];
    outputtext += writeInflow(node);

    //can get each source info if you save outputtext here.
  }//end for loop

  return outputtext;
};
