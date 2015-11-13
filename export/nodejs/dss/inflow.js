'use strict';

var fs = require('fs');
var path = require('./path');

module.exports = function(prmname, name, file) {

  return {
    csvFilePath : file,
    type : 'timeseries',
    parameter : 'FLOW_LOC(KAF)',
    location : prmname,
    units : 'KAF',
    xtype : 'PER-AVER',
    path : path.in(prmname, name, 'dss')
  };
};
