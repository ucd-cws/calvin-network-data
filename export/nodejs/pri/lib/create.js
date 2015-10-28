'use strict';
var sprintf = require('sprintf-js').sprintf;
var header = require('./write/header');

module.exports = function(pri) {
  console.log(pri.header);
  console.log('..        ***** NODE DEFINITIONS *****');
  console.log(pri.nodelist.join('\n..\n'));
  console.log('..        ***** STORAGE DEFINITIONS *****');
  console.log(pri.storlist.join('\n..\n'));
};
