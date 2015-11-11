'use strict';

var sprintf = require('sprintf-js').sprintf;
var utils = require('./utils');
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
  var link = writeLink(config, np, type || 'DIVR');
  return link;
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

  // do we have bounds
  if( np.bounds ) {
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
        b += dss.path.timeBound('QU', np.prmname)+'\n';

        
      } else if( bound.type === 'LBT' ) {
        b += dss.path.timeBound('QL', np.prmname)+'\n';
      }
    }
  }

  if( np.costs ) {
    // Monthly Variable Types Require a PQ
    if( np.costs.type === 'Monthly Variable' ) {
      for( var month in np.costs.costs ){
        pq += dss.path.monthlyPq(month, np.prmname)+'\n';
      }

    } else if( np.costs.cost >= 0 ) {
      cost = np.costs.cost.toFixed(4);

    //IF COST IS ZERO, we need a PQ
    } else {
      pq += dss.path.emptyPq()+'\n';
    }

    var dssEntries = dss.costs(np);
    for( var i = 0; i < dssEntries.length; i++ ) {
      config.pri.pd.data.push(dssEntries[i]);
    }
  }

  if( np.el_ar_cap ) {
    eac = dss.path.eac(np.prmname)+'\n';
    config.pri.pd.data.push(dss.eac(np));
  }

  if( np.inflows ) {
    for( var name in np.inflows ) {
      config.pri.inflowlist.push(writeIn(np.prmname, name));
    }
  }

  if( np.evaporation ) {
    ev = dss.path.evapo(np.prmname)+'\n';
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
    link = sprintf(LINK_FORMAT, 'LINK', '', 'RSTO', np.prmname, np.prmname, amplitude, cost, lowerBound, upperBound, constantBound)+'\n';
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
