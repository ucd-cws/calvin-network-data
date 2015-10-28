// JM - should this replace lib/write/node.js
// This is where me make the one line node definition.  Follows the header in the PRI file.
function nodeItem(np) {
  var node;

  if( np.type === 'Reservior' ) {
    node = sprintf('%-8.8s  %-10.10s %8.3d %8.3d %8.3d',
      'NODE', np.prmname,
      (np.initialstorage) ? np.initialstorage : 0.0,
      (np.el_ar_cap) ? np.el_ar_cap : 0.0,
      (np.finalstorage) ? np.finalstorage : 0.0
    );
  } else {
    node = sprintf('%-8.8s  %-10.10s', 'NODE', np.prmname);
  }

  if( np.description !== undefined ) {
    node += sprintf('\n%-8.8s  %-70.70s', 'ND', np.description);
  }

  return node;
}

// JM - replace lib/write/link.js?
function linkItem(type, np) {

  // type=CHAN,DIVR,INFL,RREL,RSTO,HREL

  var link = sprintf('LINK      %-10.10s%-10.10s%-10.10s%10.3d',
    type, np.origin, np.terminus,
    np.amplitude || 1.0
  );

  link += (np.cost) ? sprintf('%10.3d', np.cost) : sprintf('%10.10s','');
  link += (np.lbc) ? sprintf('%10.3d', np.lbc) : sprintf('%10.10s','');
  link += (np.ubc) ? sprintf('%10.3d', np.ubc) : sprintf('%10.10s','');
  link += (np.eqc) ? sprintf('%10.3d', np.eqc) : sprintf('%10.10s','');

  return link;
}
