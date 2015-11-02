'use strict';

var header = require('../pri/format/header');
var link = require('../pri/format/link');
var node = require('../pri/format/node');
var inflow = require('../pri/format/inflow');
var costs = require('../dss/cost');
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

  switch(np.type) {
    case 'Diversion':
      config.pri.linklist.push(link(np));
      break;
    case 'Reservior':
    case 'Junction':
    case 'Groundwater Storage':
    case 'Urban Demand':
       config.pri.nodelist.push(node(np));
       if( np.type === 'Reservior' ) {
         config.pri.inflow.push(inflow);
         // dss.ts.push(addTimeSeries(data,part))
         // addCost(dss.pd.data,data,part)
         config.pri.storlist.push(
           link('RSTO',{
             origin : np.prmname,
             terminus : np.prmname
           })
         );

         /*addCost(
           dssPenalties,
           ['','','STOR(KAF)-EDT','',''],
           {data : np.costs}
         );*/
       }
       break;
    default:
       console.log('ERROR: '+np.prmname+' unknown type '+np.type);
    }

  if( np.costs ) {
    costs(config.pd.data, node);
  }
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
      rtsolist : [],
      inflowlist : []
    }
  };
}

module.exports = {
  init : init,
  node_link : format,
  all : all
};
