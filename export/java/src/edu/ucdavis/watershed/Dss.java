package edu.ucdavis.watershed;

import java.util.Date;

import hec.heclib.dss.HecDss;
import hec.io.PairedDataContainer;
import hec.io.TimeSeriesContainer;

public class Dss {

	public static HecDss open(String file) throws Exception {
		return HecDss.open(file);
	}

	public static void write(Config config, CsvData data, HecDss dssFile) throws Exception {
		if( config.getType().equals("paired") ) {
			writePairedData(config, data, dssFile);
		} else {
			writeTimeSeriesData(config, data, dssFile);
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

	public static void writeTimeSeriesData(Config config, CsvData csv, HecDss dssFile) throws Exception {
		TimeSeriesContainer ts = new TimeSeriesContainer();
		
		ts.fileName = config.path;
		
		ts.startTime = parseTime(csv.data.get(0).name);
		ts.endTime = parseTime(csv.data.get(csv.data.size()-1).name);
		
		ts.values = csv.columns[0];
				
		// Approx hrs in a month
		// you shouldn't need to set this!
		ts.interval = config.getInterval(); 
		if( config.getParameter() != null ) {
			ts.parameter = config.getParameter(); //partE;
		}

		int[] quality = new int[config.getQuality().size()];
		for( int i = 0; i < quality.length; i++ ) {
			quality[i] = config.getQuality().get(i);
		}
		ts.quality = quality;

		ts.subLocation = config.getSubLocation();
		ts.subParameter = config.getSubParameter();
		ts.timeZoneID = config.getTimeZoneID();
		ts.timeZoneRawOffset = config.getTimeZoneRawOffset();

		dssFile.put(ts);
	}
	
	public static int parseTime(String datestring) {
		String[] parts = datestring.split("-");
		Date d = new Date(Integer.parseInt(parts[0]), Integer.parseInt(parts[1]), Integer.parseInt(parts[2]));
		
		// we want to store in minutes
		long t = d.getTime() / ((long)1000 * (long)60);
		
		return (int) t;
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
