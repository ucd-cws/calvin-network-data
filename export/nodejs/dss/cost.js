'use strict';

var fs = require('fs');
var path = require('./path');

module.exports = function(prmname, month, file) {
  return {
    csvFilePath : file,
    type : 'paired',
    label : month,
    date : month,
    location : prmname,
    xunits : 'KAF',
    xtype : 'DIVR',
    yunits : 'Penalty',
    ytype : '',
    path : path.monthlyPq(prmname, month, 'dss')
  };
};
