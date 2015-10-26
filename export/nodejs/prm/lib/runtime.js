'use strict';

var fs = require('fs');
var os = require('os');
var path = require('path');
var exec = require('child_process').exec;

var PARAMS_TMP_FILE = '.dssWriterParams';

module.exports = function(lib, params, callback) {
  var paramFile = path.join(process.cwd(), PARAMS_TMP_FILE);
  fs.writeFileSync(paramFile, JSON.stringify(params));

  var cmd = 'java.exe -Djava.library.path="../../lib;${env_var:PATH}" -jar ../../dssWriter.jar '+paramFile;
  if( os.type() !== 'Windows_NT' ) {
    cmd = 'wine '+cmd;
  }

  var cwd = path.join(lib, 'jre', 'bin');

  exec(cmd, {cwd: cwd},
    function (error, stdout, stderr) {
      fs.unlinkSync(paramFile);
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
