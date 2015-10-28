'use strict';

var fs = require('fs');

module.exports = function(node) {
  var costs = node.properties.costs;
  var results = [];

  if( !costs ) {
    return results;
  }

  if( costs.type === 'Monthly Variable' ) {
    for( var month in costs.costs ) {
      var file = costs.costs[month];

      if( !fs.existsSync(file) ) {
        console.log('WARNING: '+file+' does not exist');
      }

      results.push({
        csvFilePath : file,
        type : 'paired',
        label : month,
        date : month,
        location : node.properties.prmname,
        xunits : 'KAF',
        xtype : 'DIVR',
        yunits : 'Penalty',
        ytype : '',
        path : '//'+node.properties.prmname+'///'+month+'/1/'
     });
    }
  }

  return results;
};
