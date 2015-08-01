var prepare = require('./lib/prepare');

console.log('Crawling data directory...');
prepare(function(items){
  console.log(items.length);
});
