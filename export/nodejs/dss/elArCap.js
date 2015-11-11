'use strict';

var fs = require('fs');
var path = require('./path');

module.exports = function(properties) {
  var el_ar_cap = properties.el_ar_cap;

  if( !el_ar_cap ) {
    return {};
  }

  if( !fs.existsSync(el_ar_cap) ) {
    console.log('WARNING: '+el_ar_cap+' does not exist');
  }

  return {
    csvFilePath : el_ar_cap,
    type : 'paired',
    label : 'EL',
    location : properties.prmname,
    xunits : 'FT',
    xtype : 'UNT',
    yunits : 'KA',
    ytype : '',
    path : path.eac(properties.prmname, 'dss')
  };
};
