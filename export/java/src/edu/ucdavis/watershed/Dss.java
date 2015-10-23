package edu.ucdavis.watershed;

import java.io.File;

import hec.heclib.dss.HecDss;
import hec.io.PairedDataContainer;

public class Dss {

	public static HecDss open(String file) throws Exception {
		return HecDss.open(file);
	}

	public static void writePairData(String month, String prmname, double[][] data, HecDss dssFile) throws Exception{

		PairedDataContainer pdc = new PairedDataContainer();
		pdc.labels = new String[] {"", month};
		pdc.date = month;
		pdc.location = prmname;

		pdc.xunits = "KAF";
		pdc.xtype = "DIVR";
		// You split PartE on '-' So it should be eithe Q(KAF) or PS
		//pdc.xparameter = "Q(K$";
		pdc.xOrdinate = 0.0;

		pdc.yunits = "Penalty"; // Maybe K$ instead?
		pdc.ytype = ""; // Maybe Penalty ?
		// You split on PartE '-' So will always be 'EDT'
		//pdc.yparameter = "KAF)-P";
		pdc.yOrdinate = 0.0;

   // use '/'+join(part,'/') +'/'
		pdc.fullName = "//"+prmname+"///"+month+"/1/";

		pdc.xOrdinates = data[0];
		pdc.yOrdinates = new double[][] {data[1]};

		pdc.numberCurves = 1;
		pdc.numberOrdinates = pdc.xOrdinates.length;

		dssFile.put(pdc);
	}

}

// EL-AR-CAP has two curves.
public static void writeElArCap(String[5] month, part, double[][] data, HecDss dssFile) throws Exception{

	PairedDataContainer pdc = new PairedDataContainer();
	pdc.labels = new String[] {};

	pdc.xtype = "UNT"
	pdc.xOrdinate = 0.0;

	pdc.yunits = "KA";
	pdc.ytype = "UNT";
	pdc.yOrdinate = 0.0;

// pdc.fullName// use '/'+join(part,'/') +'/'

	pdc.xOrdinates = data[0];
	pdc.yOrdinates = new double[][] {data[1]};

	pdc.numberCurves = 2;
	pdc.numberOrdinates = pdc.xOrdinates.length;

	dssFile.put(pdc);
}

// Time Series
public static void writeTS(String[5] month, part, double[][] data, HecDss dssFile) throws Exception{

	TimeSeries ts = new TimeSeriesContainer();
	ts.startdate = Config.startdate
	ts.enddate = Config.enddate
	ts.interval=43200; // Approx hrs in a month
  ts.parameter=part[4] //partE;
	ts.quality='None';
	ts.sublocation='';
	ts.subparameter='';
	ts.timezoneid='None';
	ts.timesoneoffset=0;
	ts.type // ?
	ts.units // ?
	parameter|type|units|count
EVAP_RATE(FT)|PER-AVER|FT|49
FLOW_CALIB(KAF)|PER-AVER|KAF|1
FLOW_DIV(KAF)|PER-AVER|KAF|1999
FLOW_EQC(KAF)|PER-AVER|KAF|47
FLOW_GW(KAF)|PER-AVER|KAF|32
FLOW_INTER(KAF)|PER-AVER|KAF|30
FLOW_LBT(KAF)|PER-AVER|KAF|33
FLOW_LOC(KAF)|PER-AVER|KAF|50
FLOW_LOSS(KAF)|PER-AVER|KAF|22
FLOW_UBT(KAF)|PER-AVER|KAF|3
FLOW_UBT(KAF)-TARG|PER-AVER|KAF|134
FLOW_UNIMP(KAF)|PER-AVER|KAF|46
STOR|INST-VAL|KAF|85
STOR_LBT(KAF)|PER-AVER|KAF|2
STOR_UBT(KAF)|PER-AVER|KAF|8

	dssFile.put(ts);
}

}
