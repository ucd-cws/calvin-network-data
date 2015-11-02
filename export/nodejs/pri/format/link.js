'use strict';

var LINK = require('./LINK');
var utils = require('./utils');

module.exports = function(node) {
  var np = node.properties;

  //Must check if the link is a diversion before continuing
  if( type === 'Diversion') {

    var constraints = np.constraints;
    var bound_vals = '';
    var upper_const = '';
    var lower_const = '';
    var cost = '';
    var PQ = '';

    if( constraints ) {
      if(constraints.lower) {
        if( constraints.lower.bound !== undefined ) {
          lower_const = constraints.lower.bound;
        }
        if( constraints.lower.$ref ) {
          csvfile = node.repoFilePath + '/' + constraints.lower.$ref;
          bound_vals = utils.get_bound_values('BL', csvfile);
        }
      }
      if(constraints.upper) {
        if(constraints.upper.bound) {
          upper_const = constraints.upper.bound;
        }
        //csv file for constraints exists, obtain bound values
        if(constraints.upper.$ref) {
          csvfile = node.repoFilePath + '/' + constraints.upper.$ref;
          bound_vals = utils.get_bound_values('BU', csvfile);
        }
      }
    }

    if(np.costs) {
      // Monthly Variable Types Require a PQ
      if(np.costs.type === 'Monthly Variable') {
        for(var month in np.costs.costs) {
          PQ += utils.P_gen('PQ', month, 'SOUTH UPDT', origin + '_' + terminus, 'Q(K$-KAF)', '', month, '','' );
        }
      }
      //IF COST IS ZERO, we need a PQ
      else if(np.costs.cost === 0) {
        PQ += utils.P_gen('PQ','ALL', 'UCD CAP1', 'DUMMY', 'BLANK', '', '', '' );
      }

      //getting the cost
      if(np.costs.cost){
        cost = np.costs.cost;
      }
    }

    var link = LINK('DIVR', origin, terminus, amplitude, cost, lower_const, upper_const);
    var QI = utils.QI_gen(prmname, origin + '_' + terminus, 'FLOW_DIV(KAF)', '', '1MON', '');


    return link + bound_vals + PQ + QI;
  }
}
