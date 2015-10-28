'use strict';

var header = require('./write/header');
var sprintf = require('sprintf-js').sprintf;

module.exports = function(nodes) {
  var pri = {
    header   : 'EMPTY',
    nodelist : [],
    linklist : []
  };
  var np;
  var node;

  pri.header = header();

  for( var i = 0; i < nodes.length; i++ ) {
    node = nodes[i];
    np = nodes[i].properties;

    switch(np.type) {
      case 'Diversion':
        pri.linklist.push(linkItem(np));
        break;
      case 'Reservior':
      case 'Junction':
      case 'Groundwater Storage':
      case 'Urban Demand':
         pri.nodelist.push(nodeItem(np));
         if( np.type === 'Reservior' ) {
           pri.inflow.push();
           // dss.ts.push(addTimeSeries(data,part))
           // addCost(dss.pd.data,data,part)
           pri.storlist.push(
             linkItem('RSTO',{
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

    /*if( np.costs ) {
      addCost(dssPenalties.data, node);
    }*/
  }
};


// JM - should this replace lib/write/node.js
// This is where me make the one line node definition.  Follows the header in the PRI file.
function nodeItem(np) {
  var node;

  if( np.type === 'Reservior' ) {
    node = sprintf('%-8.8s  %-10.10s %8.3d %8.3d %8.3d',
      'NODE', np.prmname,
      (np.initialstorage) ? np.initialstorage : 0.0,
      (np.el_ar_cap) ? np.el_ar_cap : 0.0,
      (np.finalstorage) ? np.finalstorage : 0.0
    );
  } else {
    node = sprintf('%-8.8s  %-10.10s', 'NODE', np.prmname);
  }

  if( np.description !== undefined ) {
    node += sprintf('\n%-8.8s  %-70.70s', 'ND', np.description);
  }

  return node;
}

// JM - replace lib/write/link.js?
function linkItem(type, np) {

  // type=CHAN,DIVR,INFL,RREL,RSTO,HREL

  var link = sprintf('LINK      %-10.10s%-10.10s%-10.10s%10.3d',
    type, np.origin, np.terminus,
    np.amplitude || 1.0
  );

  link += (np.cost) ? sprintf('%10.3d', np.cost) : sprintf('%10.10s','');
  link += (np.lbc) ? sprintf('%10.3d', np.lbc) : sprintf('%10.10s','');
  link += (np.ubc) ? sprintf('%10.3d', np.ubc) : sprintf('%10.10s','');
  link += (np.eqc) ? sprintf('%10.3d', np.eqc) : sprintf('%10.10s','');

  return link;
}
