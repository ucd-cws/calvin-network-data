package edu.ucdavis.watershed;

import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;

import org.apache.commons.csv.CSVRecord;

public class CsvData {
	
	public LinkedList<Record> data = new LinkedList<Record>();
	public double[][] columns;
	public double[] firstColumn;
	
	public void add(CSVRecord record, String type) {		
		Iterator<String> itr = record.iterator();
		int i = 0;
		
		Record recordData = new Record();
		
		while( itr.hasNext() ) {
			if( i == 0 ) {
				if( type.equals("paired") ) {
					recordData.nameDouble = Double.parseDouble(itr.next());
				} else {
					recordData.name = itr.next();
				}
			} else {
				recordData.data.push(Double.parseDouble(itr.next()));
			}
			i++;
		}

		data.push(recordData);
	}
	
	public void complete(String type) {
		columns = new double[data.size()-1][];
		
		for( int i = 0; i < data.get(0).data.size(); i++ ) {
			double[] t = new double[data.size()-1];
			
			for( int j = 0; j < data.size(); j++ ) {
				t[j] = data.get(j).data.get(i);
			}
			
			columns[i] = t;
		}
		
		if( type.equals("paired") ) {
			firstColumn = new double[data.size()];
			for( int i = 0; i < data.size(); i++ ) {
				firstColumn[i] = Double.parseDouble(data.get(i).name);
			}
		}
	}

		
	public class Record {
		public String name = "";
		public double nameDouble = 0.0;
		public LinkedList<Double> data = new LinkedList<Double>();
	}
}
