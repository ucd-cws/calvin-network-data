'use strict';

var xlsx = require('xlsx');
var async = require('async');
var fs = require('fs');
var parse = require('csv-parse');
var stringify = require('csv-stringify');
var path = require('path');
var crawler = require('../crawler');

module.exports = function(args) {
  if( !fs.existsSync(args.x) ) {
    return console.log('Invalid file: '+args.x);
  }

  var workbook = xlsx.readFile(args.x);

  var items = [];

  async.eachSeries(workbook.SheetNames,
    function(name, next) {
      var worksheet = workbook.Sheets[name];
      var csv = xlsx.utils.sheet_to_csv(worksheet);

      parse(csv, {}, function(err, data){
        var item = parseHeader(data);
        if( item === null ) {
          console.log('Unable to find valid header in sheet: '+name);
        }
        items.push(item);
        next();
      });
    },
    function(err) {
      update(items, args);
    }
  );
};

function update(items, args) {
  crawler(args.data, {parseCsv:false}, function(result){

    async.eachSeries(items,
      function(item, next){
        updateNode(item, result.nodes, args.data.replace(/data\/?$/, ''), next);
      },
      function(err) {
        console.log('done.');
      }
    );

  });
}

function updateNode(item, nodes, root, callback) {
  for( var i = 0; i < nodes.length; i++ ) {
    if( item.prmname === nodes[i].properties.prmname ) {
      var file = path.join(root, nodes[i].properties.repo.dir, item.folder);
      console.log('found and updating: '+item.prmname+' '+file);

      stringify(item.data, {}, function(err, string){
        fs.writeFileSync(file, string);
        callback();
      });
      return;
    }
  }
}

function parseHeader(data) {
  if( data.length === 0 ) {
    return null;
  } else if( data[0].length < 2 ) {
    return null;
  }

  var parts = data[0][0].split('/');
  var item = {
    prmname : parts.splice(0,1)[0],
    folder : parts.join('/'),
    path : data[0][1],
    data : [[]]
  };

  data.splice(0,1);

  if( data.length < 1 ) {
    return item;
  }

  if( data[0][0] !== '' ) {
    item.data = data;
  } else {
    data.splice(0,1);
    item.data = data;
  }

  return item;
}
