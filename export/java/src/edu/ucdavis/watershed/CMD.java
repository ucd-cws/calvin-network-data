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

			// Now we have three potential writes to use.
			//part[3]='EL-AR-CAP'
			//Dss.writeElArCap(config.part,dssFile);
			//part[3] one of other penalty
			// month=part[5] prmname=part[2]
			Dss.writePairData(config.part, data, dssFile);
			//part[3] one of time-series
			//Dss.writeTimeSeries(config.part,data,dssFile);
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
