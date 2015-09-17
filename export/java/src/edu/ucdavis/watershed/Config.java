package edu.ucdavis.watershed;

public class Config {
	public String output;
	public String input;
	public String cmd;
	public String id;
	public String dir;
	
	public Config(String[] args) {
		for( int i = 0; i < args.length; i++ ) {
			if( (args[i].equals("-i") || args[i].equals("--input")) && args.length > i ) {
				this.input = args[i+1];
				i++;
			} else if( (args[i].equals("-o") || args[i].equals("--output")) && args.length > i ) {
				this.output = args[i+1];
				i++;
			} else if( (args[i].equals("-i") || args[i].equals("--id")) && args.length > i ) {
				this.id = args[i+1];
				i++;
			} else if( (args[i].equals("-d") || args[i].equals("--directory")) && args.length > i ) {
				this.dir = args[i+1];
				i++;
			} else {
				this.cmd += args[i];
			}
		}
	}
	
}
