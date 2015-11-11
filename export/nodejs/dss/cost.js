'use strict';

var fs = require('fs');
var path = require('./path');

module.exports = function(properties) {
  var costs = properties.costs;
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
        location : properties.prmname,
        xunits : 'KAF',
        xtype : 'DIVR',
        yunits : 'Penalty',
        ytype : '',
        path : path.monthlyPq(properties.prmname, month, 'dss')
     });
    }
  }

  return results;
};
