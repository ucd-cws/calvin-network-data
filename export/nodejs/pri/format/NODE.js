'use strict';

module.exports = function(node) {
  var np=node.properties;
  var NODE;

  // Check for any storage values rather than type?
  // if (np.initialstorage || np.el_ar_cap || np.finalstorage)
  // if( np.type === 'Reservior' ) {

    NODE = sprintf('%-8.8s  %-10.10s','NODE', np.prmname);
    NODE += (np.initialstorage) ? sprintf('%10.3d', np.cost) : sprintf('%10.10s','');
    NODE += (np.el_ar_cap) ? sprintf('%10.3d', np.lbc) : sprintf('%10.10s','');
    NODE += (np.finalstorage) ? sprintf('%10.3d', np.ubc) : sprintf('%10.10s','');

  if( np.description !== undefined ) {
    NODE += sprintf('\n%-8.8s  %-70.70s', 'ND', np.description);
  }
  return NODE;
};
