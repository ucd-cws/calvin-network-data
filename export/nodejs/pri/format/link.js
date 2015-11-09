'use strict';

var LINK = require('./LINK');
var utils = require('./utils');
var sprintf = require('sprintf');

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
  10, // (81-90) LICONS: constant bounds
];
var LINK_FORMAT = '';
for( var i = 0; i < LINK_SPACING.length; i++ ) {
  LINK_FORMAT += '%'+LINK_SPACING[i]+'.'+LINK_SPACING[i];
}

module.exports = function(node, type) {
  var np = node.properties;

  var link = writeLink(np, type || 'DIVR');

  //Must check if the link is a diversion before continuing
  if( type === 'Diversion') {

    var bound_vals = '';
    var upper_const = '';
    var lower_const = '';
    var cost = '';
    var PQ = '';

    var costs=(np.costs.costs)?np.costs.costs:'';

    np.ubc=?
    np.lbc=?

    var LINK = LINK('DIVR',np);


    if( np.constraints ) {
      if(np.constraints.lower) {
        if( np.constraints.lower.bound !== undefined ) {
          lower_const = np.constraints.lower.bound;
        }
        if( np.constraints.lower.$ref ) {
          csvfile = node.repoFilePath + '/' + np.constraints.lower.$ref;
          bound_vals = utils.get_bound_values('BL', csvfile);
        }
      }
      if(np.constraints.upper) {
        if(np.constraints.upper.bound) {
          upper_const = np.constraints.upper.bound;
        }
        //csv file for constraints exists, obtain bound values
        if(np.constraints.upper.$ref) {
          csvfile = node.repoFilePath + '/' + np.constraints.upper.$ref;
          bound_vals = utils.get_bound_values('BU', csvfile);
        }
      }
    }

    if(np.costs) {
      // Monthly Variable Types Require a PQ
      if(np.costs.type === 'Monthly Variable') {
        for(var month in np.costs.costs) {
          LINK += utils.parts('PQ', {MO:month,B:np.prmname,C:'Q(K$-KAF)',E:month);
        }
      }
      //IF COST IS ZERO, we need a PQ
      else if(np.costs.cost === 0) {
        LINK = utils.parts('PQ',{MO:'ALL',B:'DUMMY',C:'BLANK');
      }
    }

    var QI = utils.parts('QI',{B:np.prmname,C:'FLOW_DIV(KAF)',E:'1MON');


    return link + bound_vals + PQ + QI;
  }
}

function writeLink(np, type) {
  var amplitude = 1.0;
  if( np.amplitude !== undefined ) {
    amplitude = np.amplitude;
  }

  var pq = '';
  var cost = '', lowerBound = '', upperBound = '', constantBound = '';

  if( np.costs ) {
    // Monthly Variable Types Require a PQ
    if( np.costs.type === 'Monthly Variable' ) {
      for( var month in np.costs.costs ){
        // TODO
        //LINK += utils.parts('PQ', {MO:month,B:np.prmname,C:'Q(K$-KAF)',E:month);
      }
    } else if( np.costs.cost >= 0 ) {
      cost = np.costs.cost+'';

    //IF COST IS ZERO, we need a PQ
    } else {
      pq += writePq(np);
      LINK = utils.parts('PQ',{MO:'ALL',B:'DUMMY',C:'BLANK');
    }
  }

  var link = sprintf(LINK_FORMAT, 'LINK', '', type, np.origin, np.terminus, amplitude, cost, lowerBound, upperBound, constantBound)+'\n';
  link += sprintf('%8.8  %80.80', 'LD', np.description || '');
  link += pq;
}
