'use strict';

module.exports.LINK = function (type, node) {
  var np=node.properties;
  // type=CHAN,DIVR,INFL,RREL,RSTO,HREL

  var LINK = sprintf('LINK      %-10.10s%-10.10s%-10.10s%10.3d',
    type, np.origin, np.terminus,
    np.amplitude || 1.0
  );

  LINK += (np.cost) ? sprintf('%10.3d', np.cost) : sprintf('%10.10s','');
  LINK += (np.lbc) ? sprintf('%10.3d', np.lbc) : sprintf('%10.10s','');
  LINK += (np.ubc) ? sprintf('%10.3d', np.ubc) : sprintf('%10.10s','');
  LINK += (np.eqc) ? sprintf('%10.3d', np.eqc) : sprintf('%10.10s','');

  if( np.description !== undefined ) {
    LINK += sprintf('\n%-8.8s  %-70.70s', 'ND', np.description);
  }
  return LINK;
}
