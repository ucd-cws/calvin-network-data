'use strict';

var LINK = require('./LINK');
var utils = require('./utils');

module.exports = function(node) {
  var np=np;
  var csvfile;

  //Must check for np.type of storage before continuing
  if( np.type !== 'Surface Storage' && np.type !== 'Groundwater Storage') {
    return '';
  }

  var description = np.description;
  var lower_const = '';
  var upper_const = '';
  var BL = '';
  var BU = '';
  var QL = '';
  var QU = '';
  var PS = '';

  if( np.constraints ) {
    if( np.constraints.lower ) {
      if(np.constraints.lower.bound ) {
        lower_const = np.constraints.lower.bound;
        upper_const = '0.00'; //lower defined means upper must be defined.
      }
      //warning: this does not take into account lists of csv files.
      //(applies to all similar contraints checking)
      if(np.constraints.lower.$ref ) {
        csvfile = node.repoFilePath + '/' + np.constraints.lower.$ref;
        BL = utils.get_bound_values('L', csvfile);
      }
    }

    if( np.constraints.upper ) {
      if( np.constraints.upper.bound ) {
        upper_const = np.constraints.upper.bound;
        if(lower_const === '') {
          lower_const = '0.00'; //upper defined means lower must be defined.
        }
      }
      //csv file for np.constraints exists, obtain bound values
      if( np.constraints.upper.$ref ) {
        csvfile = node.repoFilePath + '/' + np.constraints.upper.$ref;
        BU = utils.get_bound_values('U', csvfile);
      }
    }
  }

  //Got a Time Series CSV (assumes either BL or QL will be displayed and not both)
  if(BL === 'QL') {
    BL = '';
    QL = utils.parts('QL',B:np.prmname + '-' + np.prmname,C:'STOR(KAF)',E:'1MON',F:description);
  }
  if(BU === 'QU') {
    BU = '';
    QU = utils.parts('QU',B:np.prmname + '-' + np.prmname,C:'STOR(KAF)',E:'1MON',F:description);
  }

  var link = LINK('RSTO', {properties:{np.prmname:np.prmname,lbc:lower_const,ubc:upper_cons,description:''}});

  //Setting up for EV and/or PS(Storage Penalty Function) if necessary
  if( np.costs.type === 'Monthly Variable') {
    //EV evaporation rate always included with PS
    PS += 'EV        A=' + 'UCD CAP1' + ' B=' + np.prmname + ' C=' + 'EVAP_RATE(FT)' + ' F=' + description + '\n';
    for( var month_i = 0 ; month_i < 12; month_i++) {
      PS += utils.P_gen('PS', utils.months[month_i], 'UCD CAP1', np.prmname , '', '', '', '');
    }
  }
  else if ( np.costs.type === 'Annual Variable' && np.costs.costs && np.costs.costs.length > 0) {
    var mo_label = np.costs.costs[0].label;
    PS += utils.parts('PS',{MO:mo_label ,B:'DUMMY',C:'Q(K$-KAF)'});
  }
  else {
    PS += utils.parts('PS',{MO:'ALL',B:'DUMMY',C:'BLANK'});
  }
  var QI = utils.parts('QI',{B:np.prmname, C:'STOR'});

  return link + QL + QU + BL + BU + PS + QI;
};
