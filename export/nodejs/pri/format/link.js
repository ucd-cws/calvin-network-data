'use strict';

var sprintfs=require('sprintf-js').sprintfs;
var LINK = require('./LINK');
var utils = require('./utils');

module.exports = function(node) {
  var np = node.properties;

  //Must check if the link is a diversion before continuing
  if( type === 'Diversion') {

    var bound_vals = '';
    var upper_const = '';
    var lower_const = '';
    var cost = '';
    var PQ = '';

    var costs=(np.costs.costs)?np.costs.costs:'';

//    np.ubc=?
//    np.lbc=?

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
          LINK += utils.parts('PQ', {MO:month,B:np.prmname,C:'Q(K$-KAF)',E:month});
        }
      }
      //IF COST IS ZERO, we need a PQ
      else if(np.costs.cost === 0) {
        LINK = utils.parts('PQ',{MO:'ALL',B:'DUMMY',C:'BLANK'});
      }
    }

    var QI = utils.parts('QI',{B:np.prmname,C:'FLOW_DIV(KAF)',E:'1MON'});


    return link + bound_vals + PQ + QI;
  }
}
