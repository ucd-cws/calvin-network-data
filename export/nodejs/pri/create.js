'use strict';
var sprintf = require('sprintf-js').sprintf;
var header = require('./write/header');
var utils = require('./write/utils');

module.exports = function(pri) {
  var outputtext = '';
  outputtext += pri.header;

  outputtext += '..        ***** NODE DEFINITIONS *****';
  outputtext += pri.nodelist.join('\n..\n');

  outputtext += '..        ***** STORAGE DEFINITIONS *****';
  outputtext += pri.storlist.join('\n..\n');

  outputtext += '..        ***** STORAGE LINK DEFINITIONS *****\n';
  outputtext += utils.END_gen();
  outputtext += pri.rtsolist.join('\n..\n');

  outputtext += '..        ***** INFLOW DEFINITIONS *****\n';
  outputtext += utils.END_gen();
  outputtext += pri.rtsolist.join('\n..\n');

  return outputtext;
};
