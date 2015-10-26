var walk = require('walk');
var fs = require('fs');
var dataDir = __dirname+'/../../../../data';

module.exports = function(dir, callback) {
  var items = [];

  if( typeof dir === 'function' ) {
    callback = dir;
  } else {
    dataDir = dir;
  }

  walker = walk.walk(dataDir, {});

  walker.on("file", function (root, fileStats, next) {
   var json = importGeojson(root, fileStats.name);
   if( json ) items.push(json);

   next();
  });

  walker.on("errors", function (root, nodeStatsArray, next) {
   next();
  });

  walker.on("end", function () {
    callback(items);
  });
};


function importGeojson(path, file) {
  if( !file.match(/\.geojson$/) ) return null;

  var json;
  try {
    // currently some badness in the JSON
    json = fs.readFileSync(path+'/'+file, 'utf-8').replace(/[\r\n]/g, '');
    json = JSON.parse(json);
  } catch(e) {
    console.log('Invalid JSON: '+file);
    return null;
  }

  if( !json ) return null;
  if( !json.properties ) return null;
  if( !json.properties.type || json.properties.type == 'Region' ) return null;

  json.properties.repoFilePath = path;
  json.properties.repoFilename = file;

  return json;
}
