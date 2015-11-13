'use strict';

var fs = require('fs');
var path = require('path');

var crawler = require('../../crawler');
var runtime = require('../lib/runtime');
var costs = require('../../dss/cost');
var prepare = require('../lib/prepare');
var options;
var args;

module.exports = function(argv) {
  args = argv;
  options = verify(argv);

  crawler(options.data, {parseCsv : false}, onCrawlComplete);
};

function onCrawlComplete(results){
  var config = prepare.init();
  config.pd.path = path.join(options.output || getUserHome(), options.prefix+'PD.dss');
  config.ts.path = path.join(options.output || getUserHome(), options.prefix+'TS.dss');
  var priPath = path.join(options.output || getUserHome(), options.prefix+'.pri');

  for( var i = 0; i < results.nodes.length; i++ ) {
    prepare.format(results.nodes[i], config);
  }

  console.log('Writing PRI file: '+priPath);
  fs.writeFileSync(priPath, prepare.pri(config));

  console.log('Writing Penalty DSS file: '+config.pd.path);
  writeDssFile(config.pd, function(err, resp){
    console.log('Writing TimeSeries DSS file: '+config.ts.path);
    writeDssFile(config.ts, function(err, resp){
      console.log('Done.');
    });
  });

}

function writeDssFile(dss, callback) {
  runtime(args.runtime, dss, args.debugRuntime, function(err, resp){
    if( err ) {
      console.log('ERROR: writing to dss file.');
      console.log(err);
      //return;
    }

    if( args.verbose ) {
      console.log(resp.stack);
    }

    callback();
  });
}

function verify(argv) {
  var options = {
    prefix : '',
    runtime : '',
    data : ''
  };

  if( argv._.length > 0 ) {
    options.prefix = argv._[0];
  } else if( argv.prefix ) {
    options.prefix = argv.prefix;
  }

  if( argv.r ) {
    options.runtime = argv.r;
  } else if( argv.runtime ) {
    options.runtime = argv.runtime;
  }

  if( argv.d ) {
    options.data = argv.d;
  } else if( argv.data ) {
    options.data = argv.data;
  }

  if( argv.output ) {
    options.output = argv.output;
  }

  for( var key in options ) {
    if( !options[key] ) {
      console.log('Missing '+key);
      process.exit(-1);
    }
  }

  if( !fs.existsSync(options.runtime) ) {
    console.log('Invalid runtime path: '+options.runtime);
    process.exit(-1);
  } else if( !fs.existsSync(options.data) ) {
    console.log('Invalid data repo path: '+options.data);
    process.exit(-1);
  }

  return options;
}

function getUserHome() {
  return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
}
