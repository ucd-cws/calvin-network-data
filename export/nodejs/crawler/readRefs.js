'use strict';

var async = require('async');
var readFile = require('./readFile');

// process $ref pointers
function readRefs(dir, filename, parent, attr, parseCsvData, callback) {
  var keys = Object.keys(parent[attr]);

  async.eachSeries(keys,
    function(key, next) {

      if( key === '$ref' ) {
        try {
          var file, parts = [];

          // handle files with local path ie: ./path
          if( parent[attr].$ref.match(/^\.\/.*/) ) {
            file = dir+'/'+parent[attr].$ref.replace(/^\.\//,'');
            parts.push(parent[attr].$ref.replace(/^\.\//,''));
            readFile(file, parent, attr, shouldParse(parent, parseCsvData), next);
            return;

          // handle files with without . in path ie: path/file
          } else {
            file = dir+'/'+parent[attr].$ref;
            parts.push(filename);
            parts.push(parent[attr].$ref);

            readFile(file, parent, attr, shouldParse(parent, parseCsvData), next);
            return;
          }
        } catch(e) {
          if( global.debug ) {
            console.log('  --Unabled to read: "'+file+'" ('+parent[attr].$ref+') '+JSON.stringify(parts));
          }
          parent[attr] = 'Unabled to read: '+file;
        }

      } else if( typeof parent[attr][key] === 'object' && parent[attr][key] !== null ) {
        return readRefs(dir, filename, parent[attr], key, parseCsvData, next);
      }

      setImmediate(next);
    },
    function() {
      setImmediate(callback);
    }
  );
}

// when running show commands, we don't parse csv data.  That said, the Monthly
// csv data is required for show commands.  so even if the flag is set to false
// parse monthly bounds
function shouldParse(obj, parseCsvData) {
  if( obj.bound !== undefined && (obj.type === 'UBM' || obj.type === 'LBM') ) {
    return true;
  }

  return parseCsvData;
}

module.exports = readRefs;
