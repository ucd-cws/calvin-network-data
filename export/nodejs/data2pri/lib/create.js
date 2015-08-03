var fs = require('fs');
var node_definitions = require('./nodeDefinitions');
var inflow_definitions = require('./inflowDefinitions');
var rsto_definitions = require('./rstoDefinitions');
var divr_definitions = require('./divrDefinitions');

module.exports = function(nodes) {
  nodetext = node_definitions(nodes);
  infltext = inflow_definitions(nodes);
  rstotext = rsto_definitions(nodes);
  divrtext = divr_definitions(nodes);

  individual_out(nodetext, infltext, rstotext, divrtext);
};

function individual_out(nodetext, infltext, rstotext, divrtext) {
  var homepath = process.env.HOME + '/Desktop';

  write_to_file(homepath , 'NODE.out', nodetext);
  write_to_file(homepath , 'INFL.out', infltext);
  write_to_file(homepath , 'RSTO.out', rstotext);
  write_to_file(homepath , 'DIVR.out', divrtext);
}

function write_to_file(pathname, filename, text) {
  var fullpath = pathname + '/' + filename;
  fs.writeFile(fullpath, text, function(err) {
    if(err) {
      return console.log(err);
    }
    console.log('Wrote ' + filename + ' to ' + pathname);
  });
}
