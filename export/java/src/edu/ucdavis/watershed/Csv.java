package edu.ucdavis.watershed;

import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;
import java.util.Iterator;
import java.util.LinkedList;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;

public class Csv {
	public static CsvData parseCsv(String file, String type) throws IOException {
		Reader in = new FileReader(file);
		Iterable<CSVRecord> records = CSVFormat.DEFAULT.parse(in);
		
		CsvData csvData = new CsvData();
		
		int c = 0;
		for (CSVRecord record : records) {
			c++;
			if( c == 1 ) { // ignore the first row
				continue;
			}
			csvData.add(record, type);
		}
		
		csvData.complete(type);
		

		return csvData;
	}
}
