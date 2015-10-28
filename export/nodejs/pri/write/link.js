'use strict';

var writelib = require('./writelib');

module.exports = function(node) {
  var prmname     = node.properties.prmname;
  var origin      = node.properties.origin;
  var terminus    = node.properties.terminus;
  var amplitude   = node.properties.amplitude;
  var type        = node.properties.type;
  var description = node.properties.description || '';

  //Must check if the link is a diversion before continuing
  if( type === 'Diversion') {

    var constraints = node.properties.constraints;
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
          bound_vals = writelib.get_bound_values('BL', csvfile);
        }
      }
      if(constraints.upper) {
        if(constraints.upper.bound) {
          upper_const = constraints.upper.bound;
        }
        //csv file for constraints exists, obtain bound values
        if(constraints.upper.$ref) {
          csvfile = node.repoFilePath + '/' + constraints.upper.$ref;
          bound_vals = writelib.get_bound_values('BU', csvfile);
        }
      }
    }

    if(node.properties.costs) {
      // Monthly Variable Types Require a PQ
      if(node.properties.costs.type === 'Monthly Variable') {
        for(var month in node.properties.costs.costs) {
          PQ += writelib.P_gen('PQ', month, 'SOUTH UPDT', origin + '_' + terminus, 'Q(K$-KAF)', '', month, '','' );
        }
      }
      //IF COST IS ZERO, we need a PQ
      else if(node.properties.costs.cost === 0) {
        PQ += writelib.P_gen('PQ','ALL', 'UCD CAP1', 'DUMMY', 'BLANK', '', '', '' );
      }

      //getting the cost
      if(node.properties.costs.cost){
        cost = node.properties.costs.cost;
      }
    }

    var link = writelib.LINK_gen('DIVR', origin, terminus, amplitude, cost, lower_const, upper_const);
    var LD = 'LD        ' +  description + '\n';
    var QI = writelib.QI_gen(prmname, origin + '_' + terminus, 'FLOW_DIV(KAF)', '', '1MON', '');


    return link + LD + bound_vals + PQ + QI + writelib.END_gen();
  }
}
