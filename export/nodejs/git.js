'use strict';

var exec = require('child_process').exec;

module.exports = {
    name: 'git',
    info : gitInfo
};

function gitInfo(cwd, callback) {
    var c = 0;
    var resp = {};
    function onResp(key, text) {
        resp[key] = text;
        c++;
        if( c === 4 ) {
          callback(resp);
        }
    }

    exec('git describe --tags', {cwd: cwd},
      function (error, stdout, stderr) {
        onResp('tag', stdout.replace(/\n/,''));
      }
    );
    exec('git branch | grep \'\\*\'', {cwd: cwd},
      function (error, stdout, stderr) {
        onResp('branch', stdout ? stdout.replace(/\*/,'').replace(/\s/g,'') : '');
      }
    );
    exec('git log  -1 | sed -n 1p', {cwd: cwd},
      function (error, stdout, stderr) {
        onResp('commit', stdout ? stdout.replace(/commit\s/,'').replace(/\n/g,'') : '');
      }
    );
    exec('git config --get remote.origin.url', {cwd: cwd},
      function (error, stdout, stderr) {
        if( !stdout ) {
          onResp('origin', '');
        } else if( stdout.match(/.*git@github.com:.*/) ) {
          onResp('origin', stdout.replace(/.*github.com:/,'').replace(/.git\n$/,''));
        } else {
          onResp('origin', stdout.replace(/.*github.com\//,'').replace(/.git\n$/,''));
        }
      }
    );
}
