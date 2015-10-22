'use strict';

var fs = require('fs');
var os = require('os');
var exec = require('child_process').exec;

module.exports = function(argv) {
  verify(argv);
  run(argv);
};

/**
 * DssWriter.jar flags
 *  --csvFilePath [input csv file path]
 *  --month [input csv file month]
 *  --prmname [prmname for node]
 *  --dssFilePath [where dss file should go]
 **/
function run(argv) {
  var params = {
    csvFilePath : '/Users/jrmerz/dev/watershed/calvin-network-data/data/tulare-lake/uplands/sr_scc/costs/APR.csv',
    month : 'APR',
    prmname : 'foo',
    dssFilePath : argv.output
  };

  var args = '';
  for( var key in params ) {
    args += ' --'+key+' '+params[key];
  }

  if( os.type() === 'Windows_NT' ) {
    console.log('TODO: make work in windows');
  } else {
    exec('./run.sh'+args, {cwd: argv.lib},
      function (error, stdout, stderr) {
        writeResponse(stdout);
      }
    );
  }


}

function verify(argv) {
  if( !argv.output ) {
    throw new Error('No DSS output file provided (use --output to provide DSS path)');
  } else if( !argv.append && fs.existsSync(argv.output) ) {
    throw new Error('DSS file already exists and no append flag provided (use --append to append)');
  } else if( !argv.lib ) {
    throw new Error('DSS writer runtime not provided (use --lib to provide runtime path)');
  }
}

function writeResponse(stdout) {
  var org = stdout;
  try {
    var json = stdout.match(/\{.*\}/);
    var stack = stdout.replace(json, '');
    json = JSON.parse(json);
    json.stack = stack;

    console.log(json);
  } catch(e) {
    console.log({
      error : true,
      message : 'failed to parse stdout',
      stdout  : org
    });
  }

}
