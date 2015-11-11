'use strict';

var fs = require('fs');
var writelib = require('./utils');

module.exports = function(node) {
  var prmname = node.properties.prmname;
  var outputtext = '';

  if( !node.properties.inflows ) {
    return outputtext;
  }

  var inflows = node.properties.inflows, inflow;
  for( var name in inflows ) {
    inflow = inflows[name];

    outputtext += 'LINK      INFL      SOURCE    ' + prmname + '   1.000     0.00\n';

    var partF = '';
    var LD = '';

    if( fs.existsSync(inflow.inflow) ){
      // TODO: jm - switch to csv reader lib
      var content = fs.readFileSync(inflow.inflow, 'utf-8');
      var firstline = content.split('\n')[0];

      var regex = /[A-Z0-9 _-]+/;
      var temp = firstline.split(',')[1];
      LD = temp;

      //part F needs more information to do this
      partF = temp.toUpperCase();
    }

    outputtext += 'LD        ' + LD + '\n';
    outputtext += 'IN        A='+''+' B=SOURCE_'+prmname+ ' C='+'FLOW_LOC(KAF)'+' E='+'1MON'+' F=' + partF + '\n';
  }

  return outputtext;
};
