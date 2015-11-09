'use strict';

var sprintf=require('sprintf-js').sprintf;

module.exports = function(np) {
//  var np=node.properties;
  var NODE;

  // Check for any storage values rather than type?
  // if (np.initialstorage || np.el_ar_cap || np.finalstorage)
  // if( np.type === 'Reservior' ) {

    NODE = sprintf('%-8.8s  %-10.10s','NODE', np.prmname);
    NODE += (np.initialstorage) ? sprintf('%10.3f', np.initialstorage) : sprintf('%10.10s','');
    NODE += (np.areacapfactor) ? sprintf('%10.4f', np.areacapfactor) : sprintf('%10.10s','');
    NODE += (np.endingstorage) ? sprintf('%10.3f', np.endingstorage) : sprintf('%10.10s','');

  if( np.description !== undefined ) {
    NODE += sprintf('\n%-8.8s  %-70.70s', 'ND', np.description);
  }
  return NODE;
};
