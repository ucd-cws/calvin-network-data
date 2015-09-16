# Run like: xvfb-run dssvue dss2csv.py --ts S07I30PD.dss

from hec.script import *
from hec.heclib.dss import HecDss
from hec.heclib.util import HecTime
import java
import getopt
import types
import csv
#import pandas as pd

dssfn = None
TS=False
PD=False
DATA=False
LIST=False

try:
    opts, args = getopt.getopt(sys.argv[1:],"ptcn",["pd","ts","csv=","path="])
except getopt.GetoptError:
    print 'csv2dss --csv=<csvfile> --path=<pathname> <dssfile>'
    sys.exit(2)

for opt,arg in opts:
    if opt in ("-c","--csv"):
        CSV=arg
    elif opt in ("-n","--path"):
        PATH=arg
    elif opt in ("-t","--ts"):
        TS=True
    elif opt in ("-p","--pd"):
        PD=True
    else:
        assert False, "Unhandled Option"

if (len(args) == 0):
    print 'Specify dssfile'
    sys.exit(2)

dss = HecDss.open(args[0],1)

if(CSV):
    csvfile=open(CSV,'rb')
    df=pd.read_csv(CSV)
    mon=df[0]
    print mon
    reader=csv.reader(csvfile,delimiter=',')
    if (TS):
        tsc = TimeSeriesContainer()
        tsc.fullName=PATH
else:
    assert False,"Need to Supply a CSV File"

#paths=["//AAC PWP/FLOW_DIV(KAF)/01JAN1920/1MON//"]
#paths=["//AAC PWP/FLOW_DIV(KAF)/01JAN1920/1MON//","/GWUPD_FINAL/SOURCE_D687/FLOW_LOC(KAF)/01JAN1920/1MON/ACCRETION SJR-TUOLOMNE T\O/","/GWUPD_FINAL/SOURCE_GW-1/FLOW_LOC/01JAN2000/1MON/C2VSIM/"]
#paths=["/UCD CAP1/SR-TR/EL-AR-CAP///TULLOCH RES-SANJASM_92/"]

# visited = {}
#
# for path in paths:
#     if (TS or PD):
#         flow = dss.get(path,True)
#     if (TS and hasattr(flow,'times')):
#         pathArray=path.split('/')
#         pathArray[4]=''
#         parsepath='/'.join(pathArray)
#         if (parsepath in visited):
#             continue
#         else:
#             visited[parsepath]=True
#
#         vs=[]
#
#         try:
#             for i in (range(len(flow.times))):
#                 t=HecTime()
#                 t.set(flow.times[i])
#                 date=str(t.year())+'-'+str(t.month())+'-'+str(t.day())
#                 val="%.3f}" % flow.values[i];
#                 vs.append('""('+str(date)+','+val+')""')
#         except :
#             vs=[]
#
#         v='"{'+','.join(vs)+'}"'
#         st=HecTime()
#         st.set(flow.startTime)
#         sd=str(st.year())+'-'+str(st.month())+'-'+str(st.day())
#         et=HecTime()
#         et.set(flow.endTime)
#         ed=str(et.year())+'-'+str(et.month())+'-'+str(et.day())
#         parms=['"'+path+'"',
#                sd,
#                ed,
#                str(flow.interval),
# #               str(flow.numberValues),
#                str(flow.parameter),
#                str(flow.quality),
#                str(flow.subLocation),
#                str(flow.subParameter),
#                str(flow.timeZoneID),
#                str(flow.timeZoneRawOffset),
#                str(flow.type),
#                str(flow.units),
#                v]
#         print ','.join(parms)
#     elif (PD and hasattr(flow,'date')):
#         flow = dss.get(path,True)
#         labels=[]
#         if (flow.labelsUsed):
#             for i in (range(len(flow.labels))):
#                 labels.append(flow.labels[i])
#         l='"{'+','.join(labels)+'}"'
#         vp=[]
#         for y in (range(flow.numberCurves)):
#             vs=[]
#             for i in (range(len(flow.xOrdinates))):
#                 ya=flow.yOrdinates[y]
#                 x='""(%.3f,%.3f)""' % (flow.xOrdinates[i],ya[i])
#                 vs.append(x)
#             vp.append('{'+','.join(vs)+'}')
#         v='"{'+','.join(vp)+'}"'
#
#         parms=['"'+path+'"',
#                str(flow.date),
#                str(flow.datum),
#                l,
#                str(flow.numberCurves),
#                str(flow.numberOrdinates),
#                str(flow.offset),
#                str(flow.shift),
#                str(flow.transformType),
#                v,
#                str(flow.xtype),
#                str(flow.ytype),
#                str(flow.yunits)
#            ]
#         print ','.join(parms)
#     elif (DATA):
#         flow = dss.get(path,True)
#         parms=[
#             str(flow.fullName),
#             str(flow.location),
#             str(flow.subVersion),
#             str(flow.version),
#             str(flow.watershed)
#         ];
#         print ','.join(parms)
#     elif (LIST):
#         print path
dss.done()
