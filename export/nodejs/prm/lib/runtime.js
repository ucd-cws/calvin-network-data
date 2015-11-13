'use strict';
/**
 * Wrapper for the running the hec java runtime located:
 * https://github.com/ucd-cws/calvin-network-data/releases
 */

var fs = require('fs');
var os = require('os');
var path = require('path');
var exec = require('child_process').exec;

// temp file.  we write the JSON to a temp file which is then read in
// by the jar and parsed using the jackson lib.
var PARAMS_TMP_FILE = '.dssWriterParams';

module.exports = function(lib, params, keep, callback) {
  if( typeof keep === 'function' ) {
    callback = keep;
  }

  // create tmp file in current working directory
  var paramFile = path.join(process.cwd(), PARAMS_TMP_FILE);
  fs.writeFileSync(paramFile, JSON.stringify(params, '  ', '  '));

  // run the custom dssWriter jar using the packaged java (Win 32bit), HEC's java lib and HEC's system DLL's
  // (DLL's supplied with -Djava.library.path).  The jar takes as it's first parameter the path to the tmp file.
  var cmd = 'java.exe -Djava.library.path="../../lib;${env_var:PATH}" -jar ../../dssWriter.jar '+paramFile;
  // if we are not running in windows, we need to use wine.
  if( os.type() !== 'Windows_NT' ) {
    cmd = 'wine '+cmd;
  }

  // set current working directory of the exec env to the runtime/jre/bin path.
  // This makes working with wine a little easier.
  var cwd = path.join(lib, 'jre', 'bin');

  // run
  exec(cmd, {maxBuffer: 1024 * 500, cwd: cwd},
    function (error, stdout, stderr) {
      // first thing after program runs, remove the tmp file
      if( keep !== true ) {
        fs.unlinkSync(paramFile);
      }

      writeResponse(stdout, error, stderr, callback);
    }
  );
};

function writeResponse(stdout, error, stderr, callback) {
  var org = stdout;

  try {
    // the HEC java lib pollutes stdout.  the custom dssWriter throws some
    // JSON in there as well to communicate back to us.  See if we can find
    // it.
    var json = {
      message : 'If you see this, max buffer proly exceeded',
      stack : ''
    };
    if( stdout.match(/\{.*\}/) ){
      json = stdout.match(/\{.*\}/);
      var stack = stdout.replace(json, '');
      json = JSON.parse(json);
      json.stack = stack;
    }

    callback(null, json);
  } catch(e) {
    // if we fail to find any JSON in the response, something bad happened,
    // error out and report back everything we have
    callback({
      error : error,
      message : 'failed to parse stdout',
      stdout  : org,
      stderr : stderr
    });
  }
}
