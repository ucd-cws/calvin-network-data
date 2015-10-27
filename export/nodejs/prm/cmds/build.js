'use strict';

var fs = require('fs');
var crawler = require('../../crawler');
var path = require('path');
var runtime = require('../lib/runtime');
var sprintf = require('sprintf-js').sprintf;
var costs = require('../lib/build/costs');
var options;
var args;

module.exports = function(argv) {
  args = argv;
  options = verify(argv);

  crawler(options.data, {parseCsv : false}, onCrawlComplete);
};

function onCrawlComplete(results){
  var dssPenalties = {
    path : path.join(options.output || getUserHome(), options.prefix+'PD.dss'),
    data : []
  };
    var pri={header:'EMPTY',
	     nodelist:[],
       linklist:[]
	    };
    var np;
    var node;

    function header() {
      var header=[];
      var zwts=[
        'STOR','FLOW(KAF)','FLOW_IN(KAF)','EVAP(KAF)',
        'FLOW_LOC(KAF)','FLOW_DIV(KAF)','DUAL_COST'
      ];
      var zwfrq=['STOR','FLOW(KAF)'];
      header.push('.. Capitalization Model Run');
      header.push(sprintf("%-8.8s  %-70s",'ZW','F='));
      header.push(sprintf("%-8.8s  %-10.10s%-10.10s",'IDENT','SOURCE','SINK'));
      header.push(sprintf("%-8.8s  %-10.10s%-10.10s",'TIME','OCT1921','SEP2003'));
      header.push('J11.0E-05 1.0E+06   1.0       1.0       1         3');
      // What to save
      header.push(sprintf("%-8.8s  %-70.70s",'ZWTS','-ALL'));
      header.push(sprintf("%-8.8s  %-70.70s",'ZWTS',zwts.join(' ')));
      // Not sure
      header.push(sprintf("%-8.8s  %-70.70s",'ZWFRQ',zwfrq.join(' ')));
      return header.join("\n");
    };
    // This is where me make the one line node definition.  Follows the header in the PRI file.
    function nodeItem(np) {
      var node;
      if (np.type=='Reservior') {
        node=sprintf("%-8.8s  %-10.10s %8.3d %8.3d %8.3d",
        'NODE',np.prmname,
        (np.initialstorage)?np.initialstorage:0.0,
        (np.el_ar_cap)?np.el_ar_cap:0.0,
        (np.finalstorage)?np.finalstorage:0.0);
      } else {
        node=sprintf("%-8.8s  %-10.10s",
        'NODE',np.prmname);
     }
      if (np.description) {
        node+=sprintf("\n%-8.8s  %-70.70s",'ND',np.description);
      }
    return node;
    }

    function linkItem(type,np) {
      var link;
      // type=CHAN,DIVR,INFL,RREL,RSTO,HREL
      link=sprintf("LINK      %-10.10s%-10.10s%-10.10s%10.3d",
        type,np.origin,np.terminus,
        np.amplitude || 1.0
      );
      link+=(nb.cost)?sprintf('%10.3d',np.cost):sprintf('%10.10s','');
      link+=(nb.lbc)?sprintf('%10.3d',np.lbc):sprintf('%10.10s','');
      link+=(nb.ubc)?sprintf('%10.3d',np.ubc):sprintf('%10.10s','');
      link+=(nb.eqc)?sprintf('%10.3d',np.eqc):sprintf('%10.10s','');
    }
    // This prints out Reservior Information

    pri.header=header();

//    for( var i = 0; i < 10; i++ ) {
  for( var i = 0; i < results.nodes.length; i++ ) {
    node= results.nodes[i];
      np = results.nodes[i].properties;
//      console.error(np.prmname+'('+np.type+')');

      switch(np.type) {
      case 'Diversion':
        pri.linklist.push(linkItem(np));
	       break;
      case 'Reservior':
        pri.nodelist.push(nodeItem(np));
        break;
      case 'Junction':
      case 'Groundwater Storage':
      case 'Urban Demand':
	       pri.nodelist.push(nodeItem(np));
         if (np.type='Reservior') {
           storlist.push(linkItem('RSTO',
            {origin:np.prmname,
             terminus:np.prmname
            }
           ));

         }
         break;
      default:
	       console.log('ERROR: '+np.prmname+' unknown type '+np.type);
      }

    if( np.costs ) {
	addCost(dssPenalties.data, node);
    }
  }
    //
    console.log(pri.header);
    console.log('..        ***** NODE DEFINITIONS *****');
    console.log(pri.nodelist.join("\n..\n"));
    console.log('..        ***** STORAGE DEFINITIONS *****');
    console.log(pri.storlist.join("\n..\n"));


  console.log('Writing Penalties DSS file: '+dssPenalties.path);
  runtime(options.runtime, dssPenalties, function(err, resp){
    if( err ) {
      console.log('ERROR: writing to dss file.');
      console.log(err);
    }
    console.log('Done.');

    if( args.verbose ) {
      console.log(resp.stack);
    }
  });


}

function addCost(dataArray, node) {
  var results = costs(node);
  results.forEach(function(result){
    dataArray.push(result);
  });
}

function verify(argv) {
  var options = {
    prefix : '',
    runtime : '',
    data : ''
  };

  if( argv._.length > 0 ) {
    options.prefix = argv._[0];
  } else if( argv.prefix ) {
    options.prefix = argv.prefix;
  }

  if( argv.r ) {
    options.runtime = argv.r;
  } else if( argv.runtime ) {
    options.runtime = argv.runtime;
  }

  if( argv.d ) {
    options.data = argv.d;
  } else if( argv.data ) {
    options.data = argv.data;
  }

  if( argv.output ) {
    options.output = argv.output;
  }

  for( var key in options ) {
    if( !options[key] ) {
      console.log('Missing '+key);
      process.exit(-1);
    }
  }

  if( !fs.existsSync(options.runtime) ) {
    console.log('Invalid runtime path: '+options.runtime);
    process.exit(-1);
  } else if( !fs.existsSync(options.data) ) {
    console.log('Invalid data repo path: '+options.data);
    process.exit(-1);
  }

  return options;
}

function getUserHome() {
  return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
}
