'use strict';

var fs = require('fs');
var path = require('./path');

module.exports = function(type, prmname, boundType, file) {

  return {
    csvFilePath : file,
    type : 'timeseries',
    parameter : '1MON',
    xunits : 'KAF',
    location : prmname,
    xtype : 'UNT',
    path : path.timeBound(type, prmname, boundType, 'dss')
  };
};
