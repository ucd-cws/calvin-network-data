'use strict';

var fs = require('fs');

// passed root directory, current directory name, and repo branch name
var Region = function(root, name, branch) {

    // list of child regions for this region
    // these will bubble up from the crawl
    this.subregions = [];
    // hash of all known nodes for this region
    this.nodes = {};
    // geograph (geojson) for this region
    this.geo = {};
    // this folder contains a region.json
    this.isARegion = false;
    // a sub directory, no nodes or links or region file children
    this.isAFakeRegion = true;

    this.root = root;
    this.name = name;

    // create the actual directory name
    var dir = root + (name ? '/'+name : '');
    // list files for this dir
    var files = fs.readdirSync(dir);
    var prmname, filename;

    // now loop through all files
    files.forEach(function(file) {
      // ignore all . files
      if( file.match(/^\./) ) {
        return;
      }

      // found the region.geojson, this folder is a region.
      if( file === 'region.geojson' ) {
        // read the file
        var json = fs.readFileSync(dir+'/'+file, 'utf-8');

        prmname = name.replace(/-/g,'_');
        // import the json
        this.geo = JSON.parse(json);
        // make sure the 'prmname' is set
        this.geo.properties.id = prmname;
        // set flags
        this.isARegion = true;
        this.isAFakeRegion = false;
        // that's all we need to do with this file
        return;
      }

      // read file
      var stat = fs.statSync(dir+'/'+file);

      // for child folders, we need to see if they contain a link.geojson
      // or a node.geojson file.  If so, let's add them to the region.
      // otherwise we need to crawl info folder
      var childIsLink = fs.existsSync(dir+'/'+file+'/link.geojson');
      var childIsNode = fs.existsSync(dir+'/'+file+'/node.geojson');

      // if the file is a folder and doesn't have a link or node, we need to crawl
      if( stat.isDirectory() && !childIsNode && !childIsLink ) {

        // create a new region and crawl
        var r = new Region(dir, file, branch);
        // if the child folder is in fact a region, add it to our
        // list of known regions.
        if( r.isARegion ) {
          this.subregions.push(r);
          this.isARegion = true;
        // otherwise let's bubble all the found nodes into this region
        } else if ( r.isAFakeRegion ) {
          for( prmname in r.nodes ) {
            this.nodes[prmname] = r.nodes[prmname];
          }
        }

      } else if ( stat.isDirectory() && (childIsNode || childIsLink) ) {
        // read in prmname
        prmname = file, filename = '';
        if( childIsNode ) {
          filename = dir+'/'+file+'/node.geojson';
        } else {
          filename = dir+'/'+file+'/link.geojson';
        }

        // read the node/link and clean json... some of it is poorly formatted.
        try {
          var n = eval('('+ fs.readFileSync(filename,'utf-8').replace(/[\r\n]/g,'') +')');
          this.nodes[n.properties.prmname] = n.properties.type;
        } catch(e) {
          console.log('  --JSON parse error: '+dir+' '+file);
        }

      // a file we don't care about, let the user know we are ignoring
      } else {
        console.log('  --Ignored: '+dir+' '+file);
      }
    }.bind(this));

    // now that we have the region info, dump as 'nice' JSON for MongoDB
    this.toJSON = function() {
      // get a list of all the subregion json dumps
      var sub = [];
      for (var i = this.subregions.length - 1; i >= 0; i--) {
          sub.push(this.subregions[i].toJSON());
      }

      // set the repo information for this region (for links in app)
      var repoDir = this.root.replace(/.*calvin-network-data/, '')+'/'+this.name;
      if( this.geo && this.geo.properties ) {
        this.geo.properties.repo = {
          dir : repoDir,
          github : 'https://github.com/ucd-cws/calvin-network-data/tree/'+branch + repoDir
        };
      }

      // we are ready to dump
      var json = {
          name : this.name.replace(/-/g,'_'),
          nodes : this.nodes,
          geo : this.geo
      };

      if( sub.length > 0 ) {
        json.subregions = sub;
      }

      return json;
    };

};
module.exports = Region;
