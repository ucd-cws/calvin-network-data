'use strict';

var fs = require('fs');
var path = require('./path');

module.exports = function(prmname, file) {
  return {
    csvFilePath : file,
    type : 'timeseries',
    parameter : 'EVAP_RATE(FT)',
    location : prmname,
    units : 'KAF',
    xtype : 'PER-AVER',
    path : path.evapo(prmname, 'dss')
  };
};
