'use strict';

var fs = require('fs');
var path = require('./path');

module.exports = function(prmname, file) {

  return {
    csvFilePath : file,
    type : 'timeseries',
    startTime : '1920-01-01',
    endTime : '2000-01-01',
    interval : '730',
    parameter : '1MON',
    xunits : 'FT',
    xtype : 'UNT',
    yunits : 'KA',
    ytype : '',
    path : path.timeBound(prmname, 'dss')
  };
};
