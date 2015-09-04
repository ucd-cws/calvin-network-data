"use strict";
var netfs = require('./lib/networkfs')
  , Getopt = require('node-getopt')
  , SphericalMercator = require('sphericalmercator')
  , sm , ll , pt , delta
  , getopt , opt
  , items;

getopt = new Getopt([
 ['d' , 'dir=ARG'],
 ['l' , 'll=ARG' , 'longitude-latitude pair'],
 ['t', , 'type=ARG' , 'Limit to type(s)'],
 ['x'  , 'delta=ARG', 'delta in (m) from -ll to locate pt'],
 ['r' , 'reverse', 'reverse -ll order (latitude-longitude' ],
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

if (opt.options.ll) {
    sm = new SphericalMercator ( { size:256 } );
    ll=opt.options.ll.split(',');
    if ( ll.length !== 2) {
	console.error('-ll '+opt.options.ll+' malformed.');
	process.exit(1);
    }
    if (opt.options.reverse) { ll.reverse(); }
    if (opt.options.delta) {
	delta=opt.options.delta.split(',');
	if ( delta.length !== 2) {
	    console.error('--delta '+opt.options.delta+' malformed.');
	    process.exit(1);
	}
	pt = sm.forward(ll);
	pt[0] += Number(delta[0]);
	pt[1] += Number(delta[1]);
	ll = sm.inverse(pt);
    }
}

netfs.fetch('.',function(items){
  console.log('Found '+items.length+' nodes and links.  Creating pri files...');
});

if (opt.argv) {
 netfs.each(opt.argv,function(item) {
     var json=netfs.geojson(item);
     console.info(item,json);
});
}

netfs.shorthand(function(err,paths) {
  console.log('shorthand',paths);
});

//netfs.list('.',function(items){
//    for (var i = 0; i < items.length; i++) {
//     console.log(items[i]);
//    }
//});
