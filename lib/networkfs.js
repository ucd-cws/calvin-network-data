{
"use strict";

var walk = require('walk')
  , globby = require('globby')
  , fs = require('fs')
  , path = require('path')
  ;


function shorthand(callback) {
  var shorthand = {dir:{},sh:{}};

  function get_shorthand(dirs,callback) {
    var sh
      ;

    for (var i=0; i<dirs.length;i++) {
      sh=path.basename(dirs[i],'').split('_')[0];
      if (shorthand.sh[sh]) {
        throw "Two Shorthands! "+sh;
      } else {
        shorthand.sh[sh]=dirs[i];
        shorthand.dir[dirs[i]]=sh;
      }
    }
    callback(shorthand);
  }

  globby(['**/'],function(err,dirs) {
      get_shorthand(dirs,callback)});
}

function fetch (dir, callback) {
  var items = [];

  walker = walk.walk(dir, {});

  walker.on("file", function (root,fileStats, next) {
   var json = importGeojson(root+'/'+fileStats.name);
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

function each(items,callback) {
  for (var i=0; i<items.length; i++) {
      callback(items[i]);
  }
}

function list (dir, callback) {
  var items = []
    , file
    , walker = walk.walk(dir, {});

  walker.on("file", function (root,fileStats, next) {
      file=fileStats.name;
   if (file.match(/\.geojson$/)) {
       items.push(root);
   }
   next();
  });

  walker.on("errors", function (root, nodeStatsArray, next) {
   next();
  });

  walker.on("end", function () {
   callback(items);
  });
};

function importGeojson(file) {
  if( !file.match(/\.geojson$/) ) return null;

  var json;
  try {
    // currently some badness in the JSON
    json = fs.readFileSync(file, 'utf-8').replace(/[\r\n]/g, '');
    json = JSON.parse(json);
  } catch(e) {
    console.log('Invalid JSON: '+file);
    return null;
  }

  if( !json ) return null;
  if( !json.properties ) return null;
  if( !json.properties.type || json.properties.type == 'Region' ) return null;

  json.properties.repoFile = file;

  return json;
}


function geojson(node) {
    var json
      , files=['index','region','node','link']
      , file;
    for (var i=0; i<files.length;i++) {
	try {
	    file=files[i]+".geojson";
	    json=fs.readFileSync(path.join(node,file),'utf-8');
	    console.log("Found",file);
	    break;
	} catch(e) {
	    if (e.errno !== -2) {
		console.log(e);
	    } else {
		if (i === files.length-1) {
		    console.log('Node not found')
		}
	    }
	}
    }
  try {
    // currently some badness in the JSON
    json.replace(/[\r\n]/g, '');
    json = JSON.parse(json);
  } catch(e) {
    console.log('Invalid JSON: '+node);
    return null;
  }

  if( !json ) return null;
  if( !json.properties ) return null;
  if( !json.properties.type || json.properties.type == 'Region' ) return null;

  json.properties.repoFile = file;

  return json;
}


exports.fetch=fetch;
exports.list=list;
exports.each=each;
exports.geojson=geojson;
exports.shorthand=shorthand;
};
