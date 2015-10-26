'use strict';

// process links.  currently they have no geometry information
module.exports = function(nodes, lookup) {
  var removeList = [];

  nodes.forEach(function(node){
    if( node.geometry !== null ) {
      return;
    }

    if( node.properties.origin && node.properties.terminus ) {
      var origin = lookup[node.properties.origin];
      var terminus = lookup[node.properties.terminus];

      if( !origin || !terminus ) {
        if( global.debug ) {
          console.log('  --Found link but nodes are missing geo: '+node.properties.prmname);
        }
        return;
      } else if( !origin.geometry || !terminus.geometry ) {
        if( global.debug ) {
          console.log('  --Found link but nodes are missing geo: '+node.properties.prmname);
        }
        return;
      }

      node.geometry = {
        'type': 'LineString',
        'coordinates': [
          origin.geometry.coordinates, terminus.geometry.coordinates
        ]
      };

    } else {
      if( global.debug ) {
        console.log('  --Found node with missing geo but not link: '+node.properties.prmname);
      }
      removeList.push(node);
    }
  });

  removeList.forEach(function(node){
    nodes.splice(nodes.indexOf(node), 1);
  });
};
