"use strict";
var netfs = require('../../lib/networkfs');
var Getopt = require('node-getopt');
var getopt , opt;
var items;

getopt = new Getopt([
 ['d' , 'dssfile=ARG'],
 ['h' , 'help'],
]).bindHelp();

opt = getopt.parse(process.argv.slice(2));
console.info(opt);

if (opt.options.dir) {
    try {
	process.chdir(opt.options.dir);
    }
    catch (err) {
	console.log('Cannot chdir to '+opt.options.dir+' '+ err);
    }
}

netfs.fetch('.',function(items){
  console.log('Found '+items.length+' nodes and links.  Creating pri files...');
});

if (opt.argv) {
  switch(opt.argv[0]) {
    case 'pd':
      console.info('pd');
      break;
    default:
      console.info(getopt.help());
  }
}

//netfs.list('.',function(items){
//    for (var i = 0; i < items.length; i++) {
//     console.log(items[i]);
//    }
//});
