'use strict';

var crawler = require('../../crawler');
var parse = require('csv-parse');
var async = require('async');
var fs = require('fs');

module.exports = function(type, argv) {
  if( argv._.length === 0 ) {
    console.log('You need to supply a prmname to show');
    process.exit(-1);
  }
  var prmname = argv._.splice(0,1)[0];

  var data;
  if( argv.d ) {
    data = argv.d;
  } else if( argv.data ) {
    data = argv.data;
  }

  if( !data ) {
    console.log('You need to a data directory with --data');
    process.exit(-1);
  }

  crawler(data, {parseCsv : false}, function(results){
    for( var i = 0; i < results.nodes.length; i++ ) {
      if( results.nodes[i].properties.prmname === prmname ) {
        print(type, results.nodes[i], argv.showData);
        return;
      }
    }

    console.log('prmname '+prmname+' not found.');
  });
};

function print(type, node, showData) {
  var results = [];
  if( type === 'pd' ) {
    results = require('../lib/build/cost')(node);
  } else {
    console.log('Unsupported type: '+type);
    return;
  }

  if( !showData ) {
    console.log(results);
    return;
  }

  async.eachSeries(
    results,
    function(result, next) {
      if( !fs.existsSync(result.csvFilePath) ) {
        return next();
      }

      parse(fs.readFileSync(result.csvFilePath, 'utf-8'), {comment: '#', delimiter: ','}, function(err, data){
        result.csvData = data;
        next();
      });
    },
    function() {
      for( var i = 0; i < results.length; i++ ) {
        console.log(results[i]);
      }
    }
  );
}
