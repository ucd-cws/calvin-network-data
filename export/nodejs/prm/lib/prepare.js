'use strict';

var header = require('../../pri/format/header');
var link = require('../../pri/format/link');
var node = require('../../pri/format/node');
var costs = require('../../dss/cost');
var sprintf = require('sprintf-js').sprintf;

function all(nodes) {
  var config = init();

  config.pri.header = header();

  for( var i = 0; i < nodes.length; i++ ) {
    format(nodes[i], config);
  }

  return config;
}

function format(n, config) {
  var np = n.properties;

  if( np.type !== 'Diversion' && np.type !== 'Return Flow' ) {
    config.pri.nodelist.push(node(np));
  }

  link(config, n);
}


function pri(config) {
  var text = '..\n..        ***** NODE DEFINITIONS *****\n..';
  text += config.pri.nodelist.length > 0 ? '\n'+config.pri.nodelist.join('\n..\n') : '';
  text += '\n..\n..        ***** INFLOW DEFINITIONS *****\n..';
  text += config.pri.inflowlist.length > 0 ? '\n'+config.pri.inflowlist.join('\n..\n') : '';
  text += '\n..\n..        ***** STORAGE LINK DEFINITIONS *****\n..';
  text += config.pri.rstolist.length > 0 ? '\n'+config.pri.rstolist.join('\n..\n') : '';
  text += '\n..\n..        ***** LINK DEFINITIONS *****\n..';
  text += config.pri.linklist.length > 0 ? '\n'+config.pri.linklist.join('\n..\n') : '';
  return text;
}

function init() {
  return {
    pd : {
      path : '',
      data : []
    },
    ts : {
      path : '',
      data : [],
    },
    pri : {
      header   : 'EMPTY',
      nodelist : [],
      linklist : [],
      rstolist : [],
      inflowlist : []
    }
  };
}

module.exports = {
  init : init,
  format: format,
  node_link : format,
  pri: pri,
  all : all
};
