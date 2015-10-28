'use strict';

var fs = require('fs');

module.exports = function(node) {
  var el_ar_cap = node.properties.el_ar_cap;

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
    location : node.properties.prmname,
    xunits : 'FT',
    xtype : 'UNT',
    yunits : 'KA',
    ytype : '',
    path : '//'+node.properties.prmname+'/EL-AR-CAP////'
  };
};
