'use strict';

var fs = require('fs');
var path = require('./path');

module.exports = function(prmname, file) {

  return {
    csvFilePath : file,
    type : 'timeseries',
    parameter : '1MON',
    xunits : 'FT',
    xtype : 'UNT',
    yunits : 'KA',
    ytype : '',
    path : path.timeBound(prmname, 'dss')
  };
};
