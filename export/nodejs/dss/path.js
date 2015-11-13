'use strict';
var utils = require('../pri/format/utils');

/**
 outputType == 'dss' || 'pri'
**/

// Bound types:
//  STOR: Storage
//  FLOW: flow
function writeTimeBound(type, prmname, boundType, outputType) {
  return utils.parts(type, {
    B : prmname,
    // TODO: is this correct?
    C : boundType+'_'+(type === 'QU' ? 'UBT' : 'LBT')+'(KAF)',
    E : '1MON'
  }, outputType);
  //A=HEXT2014 B=SR-CMN_SR-CMN C=STOR_UBT(KAF) E=1MON F=CAMANCHE R FLOOD CAP
}

function writeFlow(prmname) {
  return utils.parts('', {
    B : prmname,
    C : 'FLOW_LOSS(KAF)',
    E : '1MON'
  });
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
    E : '1MON',
    F: name
  }, outputType);
}

function writeEvapo(prmname, outputType) {
  return utils.parts('EV',{
    B : prmname,
    C : 'EVAP_RATE(FT)',
    E : '1MON'
  }, outputType);
}

function writeEAC(prmname, outputType) {
  return utils.parts('EAC',{
    B : prmname,
    C : 'EL-AR-CAP'
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
  flow : writeFlow,
  in : writeIn,
  evapo : writeEvapo,
  eac : writeEAC,
  empty : writeEmptyPq
};
