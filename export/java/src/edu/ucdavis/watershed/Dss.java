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
		//pdc.xparameter = "Q(K$";
		pdc.xOrdinate = 0.0;
		
		pdc.yunits = "Penalty";
		pdc.ytype = "";
		//pdc.yparameter = "KAF)-P";
		pdc.yOrdinate = 0.0;
		
		pdc.fullName = "//"+prmname+"///"+month+"/1/";
		
		pdc.xOrdinates = data[0];
		pdc.yOrdinates = new double[][] {data[1]};
		
		pdc.numberCurves = 1;
		pdc.numberOrdinates = pdc.xOrdinates.length;
		
		dssFile.put(pdc);
	}
}
