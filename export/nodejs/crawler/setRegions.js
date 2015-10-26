'use strict';

// set the regions array
function setRegions(region, path, regions, regionNames, lookup) {

  // make sure we have a unique name
  var c = 1;
  while( regionNames[region.name] ) {
    region.name = region.name.replace(/-.*/,'')+'-'+c;
    c++;
  }
  regionNames[region.name] = 1;

  regions.push(region);

  region.parents = path.split(' ');
  var newPath = (path.length > 0 ? path+' ' : '') + region.name;

  if( region.nodes && Object.keys(region.nodes).length > 0 ) {
    var min = null;
    var max = null;

    for( var prmname in region.nodes ) {
      if( lookup[prmname] ) {
        var node = lookup[prmname];
        node.properties.regions = newPath.split(' ');

        if( node.properties.type !== 'Diversion' && node.properties.type !== 'Return Flow' && node.geometry ) {
          if( min === null ) {
            min = [node.geometry.coordinates[0], node.geometry.coordinates[1]];
          }
          if( max === null ) {
            max = [node.geometry.coordinates[0], node.geometry.coordinates[1]];
          }

          updateMinMax(min, max, node.geometry.coordinates);
        }
      } else if( global.debug ) {
        console.log('Unable to find node: '+prmname+' in region '+newPath);
      }
    }

    // set a bounding box if no geometry given
    if( Object.keys(region.geo).length === 0 && min && max ) {
      region.geo = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            min,
            [min[0], max[1]],
            max,
            [max[0], min[1]],
            min
          ]]
        },
        properties : {
          id : region.name
        }
      };
    } else if( region.geo ) {
      if( !region.geo.properties )  {
        region.geo.properties = {};
      }
      region.geo.properties.id = region.name;
    }
  }

  if( !region.subregions ) {
    return;
  }

  for (var i = region.subregions.length - 1; i >= 0; i--) {
    setRegions(region.subregions[i], newPath, regions, regionNames, lookup);

    // now just set object as name reference
    region.subregions[i] = region.subregions[i].name;
  }
}

// find the min / max for a region.  if the region does not contain a geometry
// a bounding box will be assigned using the min / max values
function updateMinMax(min, max, coord) {
  if( min[0] < coord[0] ) {
    min[0] = coord[0];
  }
  if( min[1] > coord[1] ) {
    min[1] = coord[1];
  }

  if( max[0] > coord[0] ) {
    max[0] = coord[0];
  }
  if( max[1] < coord[1] ) {
    max[1] = coord[1];
  }
}

module.exports = setRegions;
