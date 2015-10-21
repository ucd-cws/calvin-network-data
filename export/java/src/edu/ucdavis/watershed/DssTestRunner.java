package edu.ucdavis.watershed;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Vector;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.apache.commons.io.FileUtils;

import hec.heclib.dss.HecDss;
import hec.io.DataContainer;
import hec.io.PairedDataContainer;
import hec.io.TimeSeriesContainer;

public class DssTestRunner {
		
	static {
		System.loadLibrary("javaHeclib");
	}
	
	public static void main(String[] args) throws Exception {
		Config config = new Config(args);
		
		//readCsvFile(config);
		
		/*if( config.dir != null ) {
			crawl(config);
			return;
		}*/
		
		return;
		
		/*HecDss dssFile = HecDss.open(System.getProperty("user.dir")+"/data/S08I49PD.dss");
		
		Vector<String> list = dssFile.getPathnameList();
		for( String item : list ) {
			process(item, dssFile);			
		}*/
	}
	
	public static void readCsvFile(Config config) throws IOException {
		/*Reader in = new FileReader(config.input);
		Iterable<CSVRecord> records = CSVFormat.DEFAULT.parse(in);
		
		for (CSVRecord record : records) {
			Iterator<String> itr = record.iterator();
			while( itr.hasNext() ) {
				
				System.out.print(itr.next()+" ");
			}
			System.out.println("");
		}*/
	}
	
	/*public static void crawl(Config config) throws Exception {
		HecDss dssFile = HecDss.open(config.output);
		
		Walker walker = new Walker();
		List<NodeCosts> costs = walker.go(config.dir);
		
		for(NodeCosts cost: costs) {
			for( int i = 0; i < cost.files.length; i++ ) {
				String month = cost.files[i].replaceAll("\\.csv", "");
				PairedDataContainer pdc = new PairedDataContainer();
				pdc.labels = new String[] {"", month};
				pdc.date = month;
				pdc.location = cost.prmname;
				
				pdc.xunits = "KAF";
				pdc.xtype = "DIVR";
				//pdc.xparameter = "Q(K$";
				pdc.xOrdinate = 0.0;
				
				pdc.yunits = "Penalty";
				pdc.ytype = "";
				//pdc.yparameter = "KAF)-P";
				pdc.yOrdinate = 0.0;
				
				pdc.fullName = "//"+cost.prmname+"///"+month+"/1/";
				
				double[][] data = parseCsv(cost.dir+File.separator+"costs"+File.separator+cost.files[i]);
				pdc.xOrdinates = data[0];
				pdc.yOrdinates = new double[][] {data[1]};
				
				pdc.numberCurves = 1;
				pdc.numberOrdinates = pdc.xOrdinates.length;
				
				dssFile.put(pdc);
			}
		}
		
		dssFile.close();
		System.out.println("Done.");
	}
	
	public static double[][] parseCsv(String file) throws IOException {
		Reader in = new FileReader(file);
		Iterable<CSVRecord> records = CSVFormat.DEFAULT.parse(in);
		
		LinkedList<Double> x = new LinkedList<Double>();
		LinkedList<Double> y = new LinkedList<Double>();
		
		int c = 0, i = 0;
		for (CSVRecord record : records) {
			c++;
			if( c == 1 ) continue;
			
			Iterator<String> itr = record.iterator();
			i = 0;
			
			while( itr.hasNext() ) {
				if( i == 0 ) x.push(Double.parseDouble(itr.next()));
				else if( i == 1 ) y.push(Double.parseDouble(itr.next()));
				i++;
			}
		}
		
		double[] xd = new double[x.size()];
		double[] yd = new double[x.size()];
		
		for( i = 0; i < x.size(); i++ ) {
			xd[i] = x.get(i);
			yd[i] = y.get(i);
		}
		

		return new double[][] {xd, yd};
	}*/
	
	
	public static void process(String item, HecDss dssFile) throws Exception {
		DataContainer dc = dssFile.get(item);
		
		
		
		System.out.println(item);
		if( dc.getClass().getName().equals("hec.io.PairedDataContainer") ){
			PairedDataContainer pdc = (PairedDataContainer) dc;
			
			System.out.println(" "+dc.watershed);
			for( int i = 0; i < pdc.yOrdinates.length; i++ ) {
				for( int j = 0; j < pdc.yOrdinates[i].length; j++ ) {
					System.out.print(pdc.yOrdinates[i][j]+" ");
				}
				System.out.println("");
			}
			
		} else {
			System.out.println("Unhandled DataContainer type: "+dc.getClass().getName());
		}
		
		
	}

}
