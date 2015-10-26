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
    path : argv.output,
    data : [{
      csvFilePath : argv.csv,
      type : 'paired',
      label : argv.month,
      date : argv.month,
      location : argv.prmname,
      xunits : 'KAF',
      xtype : 'DIVR',
      yunits : 'Penalty',
      ytype : '',
      path : '//'+argv.prmname+'///'+argv.month+'/1/'
    }]
  };

  params = JSON.stringify(params);

  var cmd = 'java.exe -Djava.library.path="../../lib;${env_var:PATH}" -jar ../../dssWriter.jar ';
  if( os.type() !== 'Windows_NT' ) {
    cmd = 'wine '+cmd;
  }
  cmd += escapeShell(params);

  var cwd = path.join(argv.lib, 'jre', 'bin');

  console.log(cmd);

  exec(cmd, {cwd: cwd},
    function (error, stdout, stderr) {
      console.log(error);
      console.log(stderr);
      writeResponse(stdout);
    }
  );
}

function escapeShell(cmd) {
  return '"'+cmd.replace(/(["\s'$`\\])/g,'\\$1')+'"';
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
