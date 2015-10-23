package edu.ucdavis.watershed;

public class Config {
	public String csvFilePath;
	public String month;
	public String prmname;
	public String path;
	public String cmd = "";
	public String[5] part;

// Can supply path either as --path or --partB, etc.  IF both,
// then use path and patch with non-null parts
// Following Default Convention HEC_PRM Pg 83

// I think we should also have a
// --start=date and --end=date which will subselect the time-series data


// Generally, PartA should be an identifier for our network-data
// PartF is the description field

	public Config(String[] args) {
		String[5] inp;

		for( int i = 0; i < args.length; i++ ) {
			if( (args[i].equals("-f") || args[i].equals("--file")) && args.length > i ) {
				this.csvFilePath = args[i+1];
				i++;
			} else if( (args[i].equals("-A") || args[i].equals("--partA")) && args.length > i ) {
				inp[0] = args[i+1];
				i++;
			} else if( (args[i].equals("-B") || args[i].equals("--partB")) && args.length > i ) {
				inp[1] = args[i+1];
				i++;
			} else if( (args[i].equals("-C") || args[i].equals("--partC")) && args.length > i ) {
				inp[2] = args[i+1];
				i++;
			} else if( (args[i].equals("-D") || args[i].equals("--partD")) && args.length > i ) {
				inp[3] = args[i+1];
				i++;
			} else if( (args[i].equals("-E") || args[i].equals("--partE")) && args.length > i ) {
				inp[4] = args[i+1];
			  i++;
			} else if( (args[i].equals("-F") || args[i].equals("--partF")) && args.length > i ) {
				inp[5] = args[i+1];
				i++;
			} else if( (args[i].equals("-f") || args[i].equals("--path")) && args.length > i ) {
				this.path = args[i+1];
				i++;
			} else {
				this.cmd += args[i];
			}
		}

// MONTH Enumeration - JAN,FEB,MAR,APR,MAY,JUN,JUL,AUG,SEP,OCT,NOV,DEC
	//	OK, at this point if we have a path, then we parse it into this.parts
	// Then for each inp[] that exists we overwrite this.parts[i] with inp[i]
	// Then we check that partC is in the following enumerations.

// These are penalty functions partC
// EL-AR-CAP
// Q(K$-KAF)-P, STOR(K$-KAF)-P
// BAD? PERSUASION, Q(KAF)

// For EL-AR-CAP all other parts are '' by Default can accept PartF
// For Q(K$-KAF)-P, and STOR(K$-KAF)-P
// fail if they do not supply PartE  PartE in enumeration of months, can accept partF

// Also the real values for these should be Q(KAF)-P_EDT and PS_EDT  Though I guess it
// doesn't matter.

// These Are Time Series inputs for partC
//EVAP_RATE(FT)
//FLOW_CALIB(KAF)
//FLOW_DIV(KAF)
//FLOW_EQC(KAF)
//FLOW_GW(KAF)
//FLOW_INTER(KAF)
//FLOW_LBT(KAF)
//FLOW_LOC(KAF)
//FLOW_LOSS(KAF)
//FLOW_UBT(KAF)
//FLOW_UBT(KAF)-TARG
//FLOW_UNIMP(KAF)
//STOR
//STOR_LBT(KAF)
//STOR_UBT(KAF)
//For all these we create partD from the first item of CSV file and
// PartE = '1MON'




	}

}
