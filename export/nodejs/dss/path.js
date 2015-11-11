'use strict';
var utils = require('../pri/format/utils');

function writeTimeBound(type, prmname) {
  return utils.parts(type, {
    B : prmname,
    // TODO: is this correct?
    C : 'STOR_'+(type === 'UB' ? 'UBT' : 'LBT')+'(KAF)'
  });
  //A=HEXT2014 B=SR-CMN_SR-CMN C=STOR_UBT(KAF) E=1MON F=CAMANCHE R FLOOD CAP
}

function writeMonthlyPq(prmname, month, outputType) {
  return utils.parts('PQ',{
    MO : month,
    B : prmname,
    C : 'Q(K$-KAF)',
    E : month
  }, outputType);
}

function writeIn(prmname, name, outputType) {
  return utils.parts('IN',{
    B : prmname,
    C : 'FLOW_LOC(KAF)',
    // E : '1MON' ... assumed
    F: name
  }, outputType);
}

function writeEvapo(prmname, outputType) {
  return utils.parts('EV',{
    B : prmname,
    C : 'EL-AR-CAP'
  }, outputType);
}

function writeEAC(prmname, outputType) {
  return utils.parts('EAC',{
    B : prmname,
    C : 'EVAP_RATE(FT)'
  }, outputType);
}

// write empty penalty function
function writeEmptyPq() {
  return utils.parts('PQ',{
    MO: 'ALL',
    B:'DUMMY',
    C:'BLANK'
  });
}

module.exports = {
  timeBound : writeTimeBound,
  monthlyPq : writeMonthlyPq,
  in : writeIn,
  evapo : writeEvapo,
  eac : writeEAC,
  empty : writeEmptyPq
};
