package edu.ucdavis.watershed;

import edu.ucdavis.watershed.Dss;
import hec.heclib.dss.HecDss;
import edu.ucdavis.watershed.Csv;

import com.fasterxml.jackson.databind.ObjectMapper;

public class CMD {
	public static void main(String[] args) {
		ObjectMapper mapper = new ObjectMapper();
		CommandLineInput input = mapper.readValue(args[0], CommandLineInput.class);
		
		try {
			HecDss dssFile = Dss.open(input.getPath());
			
			for( Config config: input.getData() ) {
				double[][] data = Csv.parseCsv(config.getCsvFilePath());
				Dss.write(config, data, dssFile);
			}
			
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
