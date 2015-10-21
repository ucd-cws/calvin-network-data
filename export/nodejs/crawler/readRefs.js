'use strict';

var async = require('async');
var readFile = require('./readFile');

// process $ref pointers
function readRefs(dir, filename, parent, attr, callback) {
  var keys = Object.keys(parent[attr]);

  async.eachSeries(keys,
    function(key, next) {

      if( key === '$ref' ) {
        try {
          var file, parts = [];
          if( parent[attr].$ref.match(/^\.\/.*/) ) {
            file = dir+'/'+parent[attr].$ref.replace(/^\.\//,'');
            parts.push(parent[attr].$ref.replace(/^\.\//,''));
            readFile(file, parent, attr, next);
            return;
          } else {
            file = dir+'/'+parent[attr].$ref;
            parts.push(filename);
            parts.push(parent[attr].$ref);

            readFile(file, parent, attr, next);
            return;
          }
        } catch(e) {
          console.log('  --Unabled to read: "'+file+'" ('+parent[attr].$ref+') '+JSON.stringify(parts));
          parent[attr] = 'Unabled to read: '+file;
        }

      } else if( typeof parent[attr][key] === 'object' && parent[attr][key] !== null ) {
        return readRefs(dir, filename, parent[attr], key, next);
      }

      setImmediate(next);
    },
    function() {
      setImmediate(callback);
    }
  );
}

module.exports = readRefs;
