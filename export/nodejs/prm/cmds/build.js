'use strict';

var fs = require('fs');
var os = require('os');
var path = require('path');
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
    csvFilePath : argv.csv,
    month : argv.month,
    prmname : argv.prmname,
    dssFilePath : argv.output
  };

  var args = '';
  for( var key in params ) {
    args += ' --'+key+' '+params[key];
  }

  var cmd = 'java.exe -Djava.library.path="../../lib;${env_var:PATH}" -jar ../../dssWriter.jar';
  if( os.type() !== 'Windows_NT' ) {
    cmd = 'wine '+cmd;
  }
  var cwd = path.join(argv.lib, 'jre', 'bin');

  exec(cmd+args, {cwd: cwd},
    function (error, stdout, stderr) {
      writeResponse(stdout);
    }
  );
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
