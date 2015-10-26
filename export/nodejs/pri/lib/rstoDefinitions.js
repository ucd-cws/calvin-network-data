var writelib = require('./writelib');

module.exports = function(nodes, filename) {
  var outputtext = '';

  outputtext += '..        ***** STORAGE LINK DEFINITIONS *****\n';
  outputtext += '..         \n';

  var i, node;

  for(i = 0; i < nodes.length; i++) {
    node = nodes[i];

    var prmname = node.properties.prmname;
    var type = node.properties.type;

    //Must check for type of storage before continuing
    if( type != 'Surface Storage' && type != 'Groundwater Storage') {
      continue;
    }

    var description = node.properties.description;
    var constraints = node.properties.constraints;
    var lower_const = '';
    var upper_const = '';
    var BL = '';
    var BU = '';
    var QL = '';
    var QU = '';
    var PS = '';

    if( constraints ) {
      if( constraints.lower ) {
        if(constraints.lower.bound ) {
          lower_const = constraints.lower.bound;
          upper_const = '0.00'; //lower defined means upper must be defined.
        }
        //warning: this does not take into account lists of csv files.
        //(applies to all similar contraints checking)
        if(constraints.lower.$ref ) {
          csvfile = node.repoFilePath + '/' + constraints.lower.$ref;
          BL = writelib.get_bound_values('L', csvfile);
        }
      }

      if( constraints.upper ) {
        if( constraints.upper.bound ) {
          upper_const = constraints.upper.bound;
          if(lower_const === '') {
            lower_const = '0.00'; //upper defined means lower must be defined.
          }
        }
        //csv file for constraints exists, obtain bound values
        if( constraints.upper.$ref ) {
          csvfile = node.repoFilePath + '/' + constraints.upper.$ref;
          BU = writelib.get_bound_values('U', csvfile);
        }
      }
    }

    //Got a Time Series CSV (assumes either BL or QL will be displayed and not both)
    if(BL == 'QL') {
      BL = '';
      QL = writelib.Q_gen('QL', 'UCD CAP1', prmname + '_' + prmname, 'STOR(KAF)', '', '1MON', description);
    }
    if(BU == 'QU') {
      BU = '';
      QU = writelib.Q_gen('QU', 'UCD CAP1', prmname + '_' + prmname, 'STOR(KAF)', '', '1MON', description);
    }


    var link = writelib.LINK_gen('RSTO', prmname, prmname, '1.000','', lower_const, upper_const);

    var LD = 'LD        ' +  description + '\n';

    //Setting up for EV and/or PS(Storage Penalty Function) if necessary
    if( node.properties.costs.type === 'Monthly Variable') {
      //EV evaporation rate always included with PS
      PS += 'EV        A=' + 'UCD CAP1' + ' B=' + prmname + ' C=' + 'EVAP_RATE(FT)' + ' F=' + description + '\n';
      for( var month_i = 0 ; month_i < 12; month_i++) {
        PS += writelib.P_gen('PS', writelib.months[month_i], 'UCD CAP1', prmname , '', '', '', '');
      }
    }
    else if ( node.properties.costs.type === 'Annual Variable' && node.properties.costs.costs && node.properties.costs.costs.length > 0) {
      var mo_label = node.properties.costs.costs[0].label;
      PS += writelib.P_gen('PS',  mo_label , 'UCD CAP1', 'DUMMY' , 'Q(K$-KAF)', '', '', '');
    }
    else {
      PS += writelib.P_gen('PS', 'ALL', 'UCD CAP1', 'DUMMY' , 'BLANK', '', '', '');
    }
    var QI = writelib.QI_gen(filename, prmname, 'STOR', '', '', '');
    outputtext += link + LD + QL + QU + BL + BU + PS + QI + writelib.END_gen();
  }

  return outputtext;
};
