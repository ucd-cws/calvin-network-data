package edu.ucdavis.watershed;

import java.util.Date;

import hec.data.meta.Catalog;
import hec.dssgui.CombinedDataManager;
import hec.heclib.dss.HecDSSUtilities;
import hec.heclib.dss.HecDss;
import hec.io.PairedDataContainer;
import hec.io.TimeSeriesContainer;

public class Dss {
	
	@SuppressWarnings("deprecation")
	public static Date EPOCH = new Date(1900, 0, 0);

	public static HecDss open(String file) throws Exception {
		return HecDss.open(file);
	}

	public static void write(Config config, CsvData data, HecDss dssFile, String file) throws Exception {
		if( config.getType().equals("paired") ) {
			writePairedData(config, data, dssFile);
		} else {
			writeTimeSeriesData(config, data, dssFile, file);
		}
	}

	public static void writePairedData(Config config, CsvData data, HecDss dssFile) throws Exception {

		PairedDataContainer pdc = new PairedDataContainer();

		if( config.label != null ) {
			pdc.labels = new String[] {"", config.label};

		}
		if( config.date != null ) {
			pdc.date = config.date;
		}

		if( config.location != null ) {
			pdc.location = config.location;
		}

		if( config.xunits != null ) {
			pdc.xunits = config.xunits;
		}

		if( config.xtype != null ) {
			pdc.xtype = pdc.xtype;
		}

		if( config.xparameter != null ) {
			pdc.xparameter = pdc.xparameter;
		}

		pdc.xOrdinate = config.xOrdinate;

		if( config.yunits != null ) {
			pdc.yunits = config.yunits;
		}

		if( config.ytype != null ) {
			pdc.ytype = config.ytype;
		}

		if( config.yparameter != null ) {
			pdc.yparameter = config.yparameter;
		}

		pdc.yOrdinate = config.yOrdinate;

		pdc.fullName = config.path;

		pdc.xOrdinates = data.firstColumn;
		pdc.yOrdinates = data.columns;

		pdc.numberCurves = config.numberCurves;
		pdc.numberOrdinates = pdc.xOrdinates.length;

		dssFile.put(pdc);
	}

	public static void writeTimeSeriesData(Config config, CsvData csv, HecDss dssFile, String file) throws Exception {
		TimeSeriesContainer ts = new TimeSeriesContainer();
	
		ts.fullName = config.path;
		ts.fileName = file;
		
		ts.times = new int[csv.data.size()];
		for( int i = 0; i < csv.data.size(); i++ ) {
			ts.times[i] = calcTime(csv.data.get(i).name);
		}
		ts.startTime = ts.times[0];
		ts.endTime = ts.times[ts.times.length-1];
		
		ts.values = csv.columns[0];
		ts.numberValues = ts.values.length;
				
		if( config.getParameter() != null ) {
			ts.parameter = config.getParameter(); //partE;
		}
		if( config.getLocation() != null ) {
			ts.location = config.getLocation(); //partE;
		}
		
		ts.type = config.getXtype();
		ts.units = config.getUnits();
	
		dssFile.put(ts);
	}
	
	@SuppressWarnings("deprecation")
	public static int calcTime(String date) {
		String[] parts = date.split("-");
		
		int year = Integer.parseInt(parts[0]);
		int month = Integer.parseInt(parts[1]);
		int day = Integer.parseInt(parts[2]);
		
		Date d = new Date(year, month, day);
		long diff = d.getTime() - EPOCH.getTime(); 
		diff = diff / (1000 * 60);
		return (int) diff;
	}

}


/*
// Time Series
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
*/
