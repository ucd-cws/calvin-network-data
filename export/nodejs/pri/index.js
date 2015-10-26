var prepare = require('./lib/prepare');
var create = require('./lib/create');

console.log('Importing data directory...');
prepare(function(items){
  console.log('Found '+items.length+' nodes and links.  Creating pri files...');
  create(items, function(){
    console.log('done.');
  });
});
