'use strict';

var header = require('../../pri/format/header');
var link = require('../../pri/format/link');
var NODE = require('../../pri/format/node');
var inflow = require('../../pri/format/inflow');
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

  switch(np.type) {
    case 'Diversion':
      config.pri.linklist.push(link(np));
      break;
    case 'Junction':
    case 'Groundwater Storage':
    case 'Surface Storage':
    case 'Urban Demand':
       config.pri.nodelist.push(NODE(np));
       if( np.type === 'Surface Storage' ) {
//         config.pri.inflow.push(inflow);
         // dss.ts.push(addTimeSeries(data,part))
         // addCost(dss.pd.data,data,part)
       for(var k in np.inflows) {
           console.log(k);
           var inf=np.inflows[k];
           console.log(inf);
           config.pri.rstolist.push(
             link('RSTO',{
               properties:{
                 type: 'Diversion',
                 origin : np.prmname,
                 terminus : np.prmname,
                 amplitude: 1,
                 description: inf.description}}));
           }

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

function pri(config) {
  var pri;
  pri+='..        ***** NODE DEFINITIONS *****';
  pri+=config.pri.nodelist.join('\n..\n');
  return pri;
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
