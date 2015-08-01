var writelib = require('./writelib');

module.exports = function(nodes) {
  var outputtext = '';

  // outputtext += '..         \n';
  // outputtext += '..         \n';
  // outputtext += '..         \n';
  // outputtext += 'LINK      DIVR      SOURCE    SINK      1.000     0.00\n';
  // outputtext += 'LD        Continuity Link\n';
  // outputtext += '..         \n';
  outputtext += '..        ***** INFLOW DEFINITIONS *****\n';
  outputtext += writelib.END_gen();

  var node, i, partF, LD;

  for(i = 0; i < nodes_list.length; i++) {
    node = nodes[i];

    if( node.properties.type !== 'Diversion' || node.properties.type !== 'Return Flow'  ) {
      var prmname = node.properties.prmname;
      if( node.properties.inflows ) {

        outputtext += 'LINK      INFL      SOURCE    ' + prmname + '   1.000     0.00\n';

        csvfile = node.repoFilePath + node.properties.inflows[0].$ref;

        partF = '';
        LD = '';

        if( fs.existsSync(csvfile)){
          // TODO: jm - switch to csv reader lib
          var content = fs.readFileSync(csvfile);
          var firstline = String(content).split('\n')[0];

          var regex = /[A-Z0-9 _-]+/;
          var temp = firstline.split(',')[1];
          LD = temp;

          //part F needs more information to do this
          partF = temp.toUpperCase();
        }

        outputtext += 'LD        ' + LD + '\n';
        outputtext += 'IN        A='+''+' B=SOURCE_'+prmname+ ' C='+'FLOW_LOC(KAF)'+' E='+'1MON'+' F=' + partF + '\n';
        outputtext += writelib.END_gen();

      }
    }
    //can get each source info if you save outputtext here.
  }//end for loop

  return outputtext;
};
