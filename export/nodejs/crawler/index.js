'use strict';

var fs = require('fs');

var async = require('async');

var setOriginsTerminals = require('./setOriginsTerminals');
var processLinks = require('./processLinks');
var readNodes = require('./readNodes');
var setRegions = require('./setRegions');
var Region = require('./region');
var git = require('../git');

var dir, branch, files;

module.exports = function(dir, options, callback) {
  if( typeof options === 'function' ) {
    callback = options;
    options = {};
  }

  var parseCsvData = true;
  if( options.parseCsv !== undefined ) {
    parseCsvData = options.parseCsv;
  }

  var debug = false;
  if( options.debug ) {
    debug = true;
  }
  global.debug = debug;

  var nodes = [];
  var regions = [];
  var regionNames = {};
  var lookup = {};

  // gather git info
  git.info(dir, function(gitInfo) {
    if( debug ) {
      console.log(gitInfo);
    }

    // recursively crawl all directories creating tree of regions, each
    // containing child nodes and links
    var ca = new Region(dir, null, gitInfo.branch);
    // set the root region as california
    ca.name = 'California';

    // dump all region data, again, this is a tree
    var json = ca.toJSON();

    if( debug ) {
      console.log('Walking '+dir+' for nodes and links.  Attaching CSV data.');
    }

    // read all nodes, and read in all $ref data
    readNodes(dir, nodes, gitInfo, parseCsvData, function(){
      if( debug ){
        console.log('Processing geojson.');
      }

      // set additional information for the nodes
      nodes.forEach(function(node){
        // set extra git info for each node
        node.properties.repo.branch = gitInfo.branch;
        node.properties.repo.commit = gitInfo.commit;
        node.properties.repo.tag = gitInfo.tag;
        node.properties.repo.repo = gitInfo.origin;

        node.properties.repo.github = 'https://github.com/'+gitInfo.origin+'/tree/'+
          gitInfo.branch + node.properties.repo.dir;

        // this hash will be used to help with link processing
        lookup[node.properties.repo.dirNodeName] = node;
        lookup[node.properties.prmname] = node;

        // set origin and terminal information for all nodes
        setOriginsTerminals(node, nodes);
      });

      // create link geometry based on node locations
      processLinks(nodes, lookup, debug);

      // preform some region post processing
      setRegions(json, '', regions, regionNames, lookup);

      // return the list of nodes/links and regions
      callback({
        nodes : nodes,
        regions : regions
      });
    });
  });
};
