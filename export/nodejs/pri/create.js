'use strict';
var sprintf = require('sprintf-js').sprintf;
var header = require('./format/header');
var utils = require('./format/utils');

module.exports = function(pri) {
  var outputtext = '';
  outputtext += pri.header();

  outputtext += '..        ***** NODE DEFINITIONS *****';
  outputtext += pri.nodelist.join('\n..\n');

  outputtext += '..        ***** STORAGE DEFINITIONS *****';
  outputtext += pri.storlist.join('\n..\n');

  outputtext += '..        ***** STORAGE LINK DEFINITIONS *****\n';
  outputtext += pri.rtsolist.join('\n..\n');

  outputtext += '..        ***** INFLOW DEFINITIONS *****\n';
  outputtext += pri.rtsolist.join('\n..\n');

  return outputtext;
};
