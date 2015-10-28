'use strict';

module.exports.months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

module.exports.END_gen = function() {
  return '..         \n';
};

module.exports.LINK_gen = function(name, source, dest, val, cost, lower_const, upper_const) {
  return 'LINK      ' + name + '      ' + source + ' ' + dest + '   ' + val + '     ' + cost + '     ' + lower_const + '    ' + upper_const + '\n';
};

module.exports.P_gen = function(name, MO, A, B, C, D, E, F) {
  return name + '       ' + ' MO=' + MO + ' A=' + A + ' B=' + B + ' C=' + C + ' D=' + D + ' E=' + E + ' F=' + F + '\n';
};

module.exports.Q_gen = function(name, A, B, C, D, E, F) {
  return name + '       ' + ' A=' + A + ' B=' + B + ' C=' + C + ' D=' + D + ' E=' + E + ' F=' + F + '\n';
}
  // QI = Initial Flow
module.exports.QI_gen = function(A, B, C, D, E, F) {
  return 'QI       ' + ' A=' + A + ' B=' + B + ' C=' + C + ' D=' + D + ' E=' + E + ' F=' + F + '\n';
};

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
