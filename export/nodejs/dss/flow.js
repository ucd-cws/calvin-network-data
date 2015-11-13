'use strict';

var fs = require('fs');
var path = require('./path');

module.exports = function(prmname, file) {

  return {
    csvFilePath : file,
    type : 'timeseries',
    parameter : 'FLOW_LOSS(KAF)',
    location : prmname,
    units : 'KAF',
    xtype : 'PER-AVER',
    path : path.flow(prmname, 'dss')
  };
};
