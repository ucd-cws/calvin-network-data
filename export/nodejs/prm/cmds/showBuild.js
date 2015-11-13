'use strict';

var crawler = require('../../crawler');
var parse = require('csv-parse');
var prepare = require('../lib/prepare');
var async = require('async');
var fs = require('fs');

module.exports = function(argv) {
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

  var config = prepare.init();
  crawler(data, {parseCsv : false}, function(results){
    for( var i = 0; i < results.nodes.length; i++ ) {
      if( results.nodes[i].properties.prmname === prmname ) {
        prepare.format(results.nodes[i], config);
        print(config, argv.showData);
        return;
      }
    }

    console.log('prmname '+prmname+' not found.');
  });
};

function print(config, showData) {
  console.log('*** Time Series ***');
  var csvFiles = [];
  for( var i = 0; i < config.ts.data.length; i++ ) {
    console.log(config.ts.data[i]);
    csvFiles.push(config.ts.data[i].csvFilePath);
  }
  console.log('*** Penalty ***');
  for( var i = 0; i < config.pd.data.length; i++ ) {
    console.log(config.pd.data[i]);
    csvFiles.push(config.pd.data[i].csvFilePath);
  }

  if( !showData ) {
    return;
  }

  async.eachSeries(
    csvFiles,
    function(file, next) {
      if( !fs.existsSync(file) ) {
        console.log('Unabled to find: '+file);
        return next();
      }

      parse(fs.readFileSync(file, 'utf-8'), {comment: '#', delimiter: ','}, function(err, data){
        console.log(data);
        next();
      });
    },
    function() {}
  );
}
