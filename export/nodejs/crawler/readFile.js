'use strict';

var parse = require('csv-parse');
var fs = require('fs');

module.exports = function(file, object, attr, callback) {
  if( file.match(/.*\.csv$/i) ) {
    object[attr] = fs.readFileSync(file, 'utf-8');

    parse(object[attr], {comment: '#', delimiter: ','}, function(err, data){
      if( attr === '' ) { // hack need to fix
        console.log('Attempting to set empty attr name, switching to "data": '+file);
        delete object[attr];
        attr = 'data';
      }

      if( err ) {
        object[attr] = err;
      } else {
        object[attr] = parseInts(data);
      }
      setImmediate(callback);
    });
  } else {
    object[attr] = fs.readFileSync(file, 'utf-8');
    setImmediate(callback);
  }
};


function parseInts(data) {
  for( var i = 0; i < data.length; i++ ) {
    for( var j = 0; j < data[i].length; j++ ) {
      if( data[i][j].match(/^-?\d+\.?\d*$/) || data[i][j].match(/^-?\d*\.\d+$/) ) {
        var t = parseFloat(data[i][j]);
        if( !isNaN(t) ) {
          data[i][j] = t;
        }
      }
    }
  }
  return data;
}
