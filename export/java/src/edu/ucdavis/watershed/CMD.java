package edu.ucdavis.watershed;

import edu.ucdavis.watershed.Dss;
import hec.heclib.dss.HecDss;
import edu.ucdavis.watershed.Csv;

public class CMD {
	public static void main(String[] args) {
		Config config = new Config(args);
		
		try {
			HecDss dssFile = Dss.open(config.dssFilePath);
			double[][] data = Csv.parseCsv(config.csvFilePath);
			Dss.writePairData(config.month, config.prmname, data, dssFile);
		} catch (Exception e) {
			printError(e.getMessage());
			return;
		}
		
		printSuccess();
	}
	
	public static void printError(String message) {
		System.out.println("{\"error\":true,\"message\":\""+message+"\"}");
	}
	
	public static void printSuccess() {
		System.out.println("{\"success\":true}");
	}
}
