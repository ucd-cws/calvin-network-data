package edu.ucdavis.watershed;

public class Config {
	public String csvFilePath;
	public String month;
	public String prmname;
	public String dssFilePath;
	public String cmd = "";

	public Config(String[] args) {
		for( int i = 0; i < args.length; i++ ) {
			if( (args[i].equals("-c") || args[i].equals("--csvFilePath")) && args.length > i ) {
				this.csvFilePath = args[i+1];
				i++;
			} else if( (args[i].equals("-m") || args[i].equals("--month")) && args.length > i ) {
				this.month = args[i+1];
				i++;
			} else if( (args[i].equals("-p") || args[i].equals("--prmname")) && args.length > i ) {
				this.prmname = args[i+1];
				i++;
			} else if( (args[i].equals("-d") || args[i].equals("--dssFilePath")) && args.length > i ) {
				this.dssFilePath = args[i+1];
				i++;
			} else {
				this.cmd += args[i];
			}
		}
	}
	
}
