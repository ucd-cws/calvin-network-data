'use strict';
var sprintf = require('sprintf-js').sprintf;

var zwts = [
  'STOR','FLOW(KAF)','FLOW_IN(KAF)','EVAP(KAF)',
  'FLOW_LOC(KAF)','FLOW_DIV(KAF)','DUAL_COST'
];

var zwfrq = ['STOR','FLOW(KAF)'];

module.exports = function() {
  var header = [];

  header.push('.. Capitalization Model Run');
  header.push(sprintf('%-8.8s  %-70s','ZW','F='));
  header.push(sprintf('%-8.8s  %-10.10s%-10.10s','IDENT','SOURCE','SINK'));
  header.push(sprintf('%-8.8s  %-10.10s%-10.10s','TIME','OCT1921','SEP2003'));
  header.push('J11.0E-05 1.0E+06   1.0       1.0       1         3');

  // What to save
  header.push(sprintf('%-8.8s  %-70.70s','ZWTS','-ALL'));
  header.push(sprintf('%-8.8s  %-70.70s','ZWTS',zwts.join(' ')));

  // Not sure
  header.push(sprintf('%-8.8s  %-70.70s','ZWFRQ',zwfrq.join(' ')));
  return header.join('\n');
};
