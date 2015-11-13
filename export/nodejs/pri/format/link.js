'use strict';

var sprintf = require('sprintf-js').sprintf;
var utils = require('./utils');
var fs = require('fs');
var dss = require('../../dss');

// from page 58 of manual
var LINK_SPACING = [
  4, // (1-4) CINREC: LINK
  6, // empty
  10, // (11-20) LINKTY: type of link
  10, // (21-30) LIFROM: origin
  10, // (31-40) LINKTO: terminus
  10, // (41-50) LIAMP: amplitude
  10, // (51-60) LICOST: constant cost
  10, // (61-70) LILOWR: lower bound
  10, // (71-80) LIUPPR: upper bound
  10 // (81-90) LICONS: constant bounds
];
var LINK_FORMAT = '';
for( var i = 0; i < LINK_SPACING.length; i++ ) {
  LINK_FORMAT += '%-'+LINK_SPACING[i]+'.'+LINK_SPACING[i]+'s';
}

module.exports = function(config, node, type) {
  var np = node.properties;
  writeLink(config, np, type || 'DIVR');
};

function writeLink(config, np, type) {
  var amplitude = 1.0;
  if( np.amplitude !== undefined ) {
    amplitude = np.amplitude.toFixed(4);
  }

  var pq = '';
  var b = '';
  var ev = '';
  var eac = '';
  var inf = '';
  var cost = '', lowerBound = '', upperBound = '', constantBound = '';

  var prmname = np.prmname;
  if( np.type === 'Surface Storage' ) {
    prmname = prmname+'_'+prmname;
  }

  // do we have bounds
  if( np.bounds ) {

    var boundType;
    if( np.type === 'Surface Storage' ) {
      boundType = 'STOR';
    } else {
      boundType = 'FLOW';
    }

    // add constant bounds
    for( var i = 0; i < np.bounds.length; i++ ) {
      var bound = np.bounds[i];

      if( bound.type === 'UBC' ) {
        upperBound = bound.bound.toFixed(4);
      } else if( bound.type === 'LBC' ) {
        lowerBound = bound.bound.toFixed(4);
      } else if( bound.type === 'EQC' ) {
        constantBound = bound.bound.toFixed(4);
      } else if( bound.type === 'UBM' ) {
        b += writeMonthlyBound('UB', bound)+'\n';
      } else if( bound.type === 'LBM' ) {
        b += writeMonthlyBound('LB', bound)+'\n';
      } else if( bound.type === 'UBT' ) {
        if( !fs.existsSync(bound.bound) ) {
          console.log('File not found, ignoring: '+bound.bound);
          continue;
        }
        // set pri path
        b += dss.path.timeBound('QU', prmname, boundType)+'\n';
        // set dss writer json object
        config.ts.data.push(dss.bound('QU', prmname, boundType, bound.bound));


      } else if( bound.type === 'LBT' ) {
        // set pri path
        b += dss.path.timeBound('QL', prmname, boundType)+'\n';
        // set dss writer json object
        config.ts.data.push(dss.bound('QL', prmname, boundType, bound.bound));
      }
    }
  }

  if( np.costs ) {
    // Monthly Variable Types Require a PQ
    if( np.costs.type === 'Monthly Variable' ) {
      for( var month in np.costs.costs ){
        if( !fs.existsSync(np.costs.costs[month]) ) {
          console.log('File not found, ignoring: '+np.costs.costs[month]);
          continue;
        }

        // set pri path
        pq += dss.path.monthlyPq(month, prmname)+'\n';
        // set dss writer json object
        config.pd.data.push(dss.cost(prmname, month, np.costs.costs[month]));
      }

    } else if( np.costs.cost >= 0 ) {
      cost = np.costs.cost.toFixed(4);

    //IF COST IS ZERO, we need a PQ
    } else {
      pq += dss.path.empty()+'\n';
    }
  }

  if( np.el_ar_cap ) {
    if( !fs.existsSync(np.el_ar_cap) ) {
      console.log('File not found, ignoring: '+np.el_ar_cap);
    } else {
      eac = dss.path.eac(prmname)+'\n';
      config.pd.data.push(dss.eac(np.prmname, np.el_ar_cap));
    }
  }


  if( np.inflows ) {
    for( var name in np.inflows ) {
      if( !fs.existsSync(np.inflows[name].inflow) ) {
        console.log('File not found, ignoring: '+np.inflows[name].inflow);
        continue;
      }

      config.pri.inflowlist.push(writeIn(prmname, name));

      // set dss writer json object
      config.ts.data.push(dss.inflow(prmname, name, np.inflows[name].inflow));
    }
  }

  if( np.evaporation ) {
    if( !fs.existsSync(np.evaporation) ) {
      console.log('File not found, ignoring: '+np.evaporation);
    } else {
      ev = dss.path.evapo(prmname)+'\n';
      // set dss writer json object
      config.ts.data.push(dss.evapo(prmname, np.evaporation));
    }
  }

  var link = '';

  if( np.type === 'Diversion' || np.type === 'Return Flow' ) {
    link = sprintf(LINK_FORMAT, 'LINK', '', type, np.origin, np.terminus, amplitude, cost, lowerBound, upperBound, constantBound)+'\n';
    link += sprintf('%-8.8s  %-80.80s', 'LD', np.description || '')+'\n';
    link += b;
    link += ev;
    link += eac;
    link += pq;
    config.pri.linklist.push(link.replace(/\n$/,''));
  }

  if( np.type === 'Surface Storage' ) {
    link = sprintf(LINK_FORMAT, 'LINK', '', 'RSTO', prmname, prmname, amplitude, cost, lowerBound, upperBound, constantBound)+'\n';
    link += sprintf('%-8.8s  %-80.80s', 'LD', np.description || '')+'\n';
    link += b;
    link += ev;
    link += eac;
    link += pq;
    config.pri.rstolist.push(link.replace(/\n$/,''));
  }
}

function writeMonthlyBound(type, bound) {
  var data = [];
  for( var i = 0; i < bound.bound.length; i++ ) {
    // check to see if the data array has a header
    if( i === 0 && typeof bound.bound[i][1] === 'string' ) {
      continue;
    }
    data.push(bound.bound[i][1]);
  }

  // NOTE: reference/example pri file has 8 spaces before data: ex: 'BU        1,2,3,4..'
  // defined in documentation as: 1-2 (CINREC) then (3-n) LIUPPR
  return type+'        '+data.join(',');
}

function writeIn(prmname, name, description) {
  var inf = sprintf(LINK_FORMAT, 'LINK', '', 'INFLOW', 'SOURCE', prmname, 1, 0, '', '', '')+'\n';
  inf += sprintf('%-8.8s  %-80.80s', 'LD', description || '')+'\n';
  inf += dss.path.in(prmname, name)+'\n';
  return inf;
}
