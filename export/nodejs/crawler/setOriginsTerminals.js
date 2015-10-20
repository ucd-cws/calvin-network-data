'use strict';

module.exports = function(node, nodes) {
  if( node.properties.type === 'Diversion' || node.properties.type === 'Return Flow' )  {
    return;
  }

  var origins = [];
  var terminals = [];
  for( var i = 0; i < nodes.length; i++ ) {
    if( nodes[i].properties.terminus === node.properties.prmname ) {
      origins.push({
        prmname : nodes[i].properties.origin,
        link_prmname : nodes[i].properties.prmname
      });
    } else if ( nodes[i].properties.origin === node.properties.prmname ) {
      terminals.push({
        prmname : nodes[i].properties.terminus,
        link_prmname : nodes[i].properties.prmname
      });
    }
  }

  node.properties.origins = origins;
  node.properties.terminals = terminals;
};
