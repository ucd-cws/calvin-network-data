'use strict';

var sprintf = require('sprintf-js').sprintf;
var utils = require('./utils');

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

module.exports = function(node, type) {
  var np = node.properties;

  var link = writeLink(np, type || 'DIVR');

  //var QI = utils.parts('QI',{B:np.prmname,C:'FLOW_DIV(KAF)',E:'1MON'});


  //  return link + bound_vals + PQ + QI;
  //}
  return link;
};

function writeLink(np, type) {
  var amplitude = 1.0;
  if( np.amplitude !== undefined ) {
    amplitude = np.amplitude;
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
        upperBound = bound.bound;
      } else if( bound.type === 'LBC' ) {
        lowerBound = bound.bound;
      } else if( bound.type === 'EQC' ) {
        constantBound = bound.bound;
      } else if( bound.type === 'UBM' ) {
        b += writeMonthlyBound('UB', bound)+'\n';
      } else if( bound.type === 'LBM' ) {
        b += writeMonthlyBound('LB', bound)+'\n';
      } else if( bound.type === 'UBT' ) {
        b += writeTimeBound('QU', np.prmname)+'\n';
      } else if( bound.type === 'LBT' ) {
        b += writeTimeBound('QL', np.prmname)+'\n';
      }
    }
  }

  if( np.costs ) {
    // Monthly Variable Types Require a PQ
    if( np.costs.type === 'Monthly Variable' ) {
      for( var month in np.costs.costs ){
        pq += writeMonthlyPq(month, np.prmname)+'\n';
      }

    } else if( np.costs.cost >= 0 ) {
      cost = np.costs.cost+'';

    //IF COST IS ZERO, we need a PQ
    } else {
      pq += writeEmptyPq()+'\n';
    }
  }

  if( np.el_ar_cap ) {
    eac = writeEAC(np.prmname);
  }

  if( np.inflows ) {
    inf = writeIn(np.prmname);
  }

  if( np.evaporation ) {
    ev = writeEvapo(np.prmname);
  }

  var link = sprintf(LINK_FORMAT, 'LINK', '', type, np.origin, np.terminus, amplitude, cost, lowerBound, upperBound, constantBound)+'\n';
  link += sprintf('%-8.8s  %-80.80s', 'LD', np.description || '')+'\n';
  link += b;
  link += ev;
  link += eac;
  link += inf;
  link += pq;

  return link;
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

function writeTimeBound(type, prmname) {
  return utils.parts(type,{
    B : prmname,
    // TODO: is this correct?
    C : 'STOR_'+(type === 'UB' ? 'UBT' : 'LBT')+'(KAF)'
  });
  //A=HEXT2014 B=SR-CMN_SR-CMN C=STOR_UBT(KAF) E=1MON F=CAMANCHE R FLOOD CAP
}

function writeMonthlyPq(prmname, month) {
  return utils.parts('PQ',{
    MO : month,
    B : prmname,
    C : 'Q(K$-KAF)',
    E : month
  });
}


function writeIn(prmname) {
  return utils.parts('IN',{
    B : prmname,
    C : 'FLOW_LOC(KAF)'
    // E : '1MON' ... assumed
  });
}

function writeEvapo(prmname) {
  return utils.parts('EV',{
    B : prmname,
    C : 'EL-AR-CAP'
  });
}

function writeEAC(prmname) {
  return utils.parts('EAC',{
    B : prmname,
    C : 'EVAP_RATE(FT)'
  });
}

// write empty penalty function
function writeEmptyPq() {
  return utils.parts('PQ',{
    MO : 'ALL',
    B:'DUMMY',
    C:'BLANK'
  });
}
