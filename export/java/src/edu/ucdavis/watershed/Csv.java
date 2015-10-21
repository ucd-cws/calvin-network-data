package edu.ucdavis.watershed;

import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;
import java.util.Iterator;
import java.util.LinkedList;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;

public class Csv {
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
	}
}
