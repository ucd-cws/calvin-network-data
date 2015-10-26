'use strict';

var fs = require('fs');
var os = require('os');
var path = require('path');
var exec = require('child_process').exec;


module.exports = function(lib, params, callback) {

  params = JSON.stringify(params);

  var cmd = 'java.exe -Djava.library.path="../../lib;${env_var:PATH}" -jar ../../dssWriter.jar ';
  if( os.type() !== 'Windows_NT' ) {
    cmd = 'wine '+cmd;
  }
  cmd += escapeShell(params);

  var cwd = path.join(lib, 'jre', 'bin');

  console.log(cmd);

  exec(cmd, {cwd: cwd},
    function (error, stdout, stderr) {
      writeResponse(stdout, error, stderr, callback);
    }
  );
};

function escapeShell(cmd) {
  return '"'+cmd.replace(/(["\s'$`\\])/g,'\\$1')+'"';
}

function writeResponse(stdout, error, stderr, callback) {
  var org = stdout;

  try {
    var json = stdout.match(/\{.*\}/);
    var stack = stdout.replace(json, '');
    json = JSON.parse(json);
    json.stack = stack;

    callback(null, json);
  } catch(e) {
    callback({
      error : error,
      message : 'failed to parse stdout',
      stdout  : org,
      stderr : stderr
    });
  }

}
