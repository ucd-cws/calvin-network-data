'use strict';

var sprintf = require('sprintf-js').sprintf;

module.exports.months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

module.exports.parts = function(type, p, outputType) {
  if( outputType === 'dss' ) {
    return sprintf('/%s/%s/%s/%s/%s/%s',
      (p.A) ? p.A : '',
      (p.B) ? p.B : '',
      (p.C) ? p.C : '',
      (p.D) ? p.D : '',
      (p.E) ? p.E : '',
      (p.F) ? p.F : ''
    );
  } else {
    return sprintf('%-3.3s%6.6s%sA=%s B=%s C=%s D=%s E=%s F=%s',
      type,
      '',
      (p.MO) ? ' MO='+p.MO+' ':' ',
      (p.A) ? p.A : '',
      (p.B) ? p.B : '',
      (p.C) ? p.C : '',
      (p.D) ? p.D : '',
      (p.E) ? p.E : '',
      (p.F) ? p.F : ''
    );
  }


}

module.exports.BOUND_gen = function(bounds_values) {
  var output = outstr;
  if( bounded_values !== '') { //will check if contents fit regex if necessary
    output = output + 'BU        ' + bounded_values + '\n';
  }
  return output;
};

module.exports.get_bound_values = function(thebound, bound_path){
  var output = '';
  if( fs.existsSync(bound_path)){
    var content = fs.readFileSync(bound_path);
    var mydata = String(content).split('\n');
    var btypecheck = mydata[0].split(',');

    //BL or BU
    if( btypecheck[1] === 'Monthly') {
      var startindex = mydata.indexOf('bound,');
      bound_vals = '';
      for( var bindex = startindex + 1; bindex < mydata.length; bindex++) {
        if(/\d+[.]?\d*,/.test(mydata[bindex])) {
          bound_vals = bound_vals + mydata[bindex];
        }
      }
      //this assumes that the CSV file contains dates
      output = 'B' + thebound + '        ' + bound_vals + '\n';
    }
    //QL or QU, the constraints for the upper/lower dates
    else if(btypecheck[1] == 'TimeSeries') {
      output = 'Q' + thebound;
    }
  }
  return output;
};
