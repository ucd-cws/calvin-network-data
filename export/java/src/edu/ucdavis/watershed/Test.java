package edu.ucdavis.watershed;

import java.io.File;
import java.util.Vector;

import com.fasterxml.jackson.databind.ObjectMapper;

import hec.heclib.dss.HecDss;
import hec.io.TimeSeriesContainer;


public class Test {
	public static void main(String[] args) throws Exception {		
		//try {
		int t= 0;
		HecDss dssFile = Dss.open("E:\\S09I05\\S09I05TS.dss");
		Vector<String> v =  dssFile.getPathnameList();
		for( String path: v) {
			System.out.println(path);
			TimeSeriesContainer ts = (TimeSeriesContainer) dssFile.get(path);

			t = 1;
		}
		
		TimeSeriesContainer ts = (TimeSeriesContainer) dssFile.get("/HEXT2014/C131_SINK G12/FLOW_LOSS(KAF)/01JAN1920/1MON/CALSIM - D889/",true);
		t =1;
		t++;
	}
}
