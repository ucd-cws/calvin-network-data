package edu.ucdavis.watershed;

public class Config {
	public String csvFilePath = null;
	public String path = null; // for dss file
	public String type = "paired";
	public String label = null;
	public String location = null;
	public String date = null;
	public String xunits = null;
	public String xtype = null;
	public String xparameter = null;
	public double xOrdinate = 0.0;
	public String yunits = null;
	public String ytype = null;
	public String yparameter = null;
	public double yOrdinate = 0.0;
	public double numberCurves = 1;
	

	public String startdate = null;
	public String enddate = null;
	public int interval = 43200; // Approx hrs in a month
	public String parameter = null; //partE;
	public String quality = "None";
	public String sublocation = "";
	public String subparameter = "";
	public String timezoneid = "None";
	public int timesoneoffset = 0;
	public String units = "";

// Can supply path either as --path or --partB, etc.  IF both,
// then use path and patch with non-null parts
// Following Default Convention HEC_PRM Pg 83

// I think we should also have a
// --start=date and --end=date which will subselect the time-series data


// Generally, PartA should be an identifier for our network-data
// PartF is the description field

	public Config() {}

	public String getCsvFilePath() {
		return csvFilePath;
	}

	public void setCsvFilePath(String csvFilePath) {
		this.csvFilePath = csvFilePath;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public String getXunits() {
		return xunits;
	}

	public void setXunits(String xunits) {
		this.xunits = xunits;
	}

	public String getXtype() {
		return xtype;
	}

	public void setXtype(String xtype) {
		this.xtype = xtype;
	}

	public String getXparameter() {
		return xparameter;
	}

	public void setXparameter(String xparameter) {
		this.xparameter = xparameter;
	}

	public double getxOrdinate() {
		return xOrdinate;
	}

	public void setxOrdinate(double xOrdinate) {
		this.xOrdinate = xOrdinate;
	}

	public String getYunits() {
		return yunits;
	}

	public void setYunits(String yunits) {
		this.yunits = yunits;
	}

	public String getYtype() {
		return ytype;
	}

	public void setYtype(String ytype) {
		this.ytype = ytype;
	}

	public String getYparameter() {
		return yparameter;
	}

	public void setYparameter(String yparameter) {
		this.yparameter = yparameter;
	}

	public double getyOrdinate() {
		return yOrdinate;
	}

	public void setyOrdinate(double yOrdinate) {
		this.yOrdinate = yOrdinate;
	}

	public double getNumberCurves() {
		return numberCurves;
	}

	public void setNumberCurves(double numberCurves) {
		this.numberCurves = numberCurves;
	}

	public String getStartdate() {
		return startdate;
	}

	public void setStartdate(String startdate) {
		this.startdate = startdate;
	}

	public String getEnddate() {
		return enddate;
	}

	public void setEnddate(String enddate) {
		this.enddate = enddate;
	}

	public int getInterval() {
		return interval;
	}

	public void setInterval(int interval) {
		this.interval = interval;
	}

	public String getParameter() {
		return parameter;
	}

	public void setParameter(String parameter) {
		this.parameter = parameter;
	}

	public String getQuality() {
		return quality;
	}

	public void setQuality(String quality) {
		this.quality = quality;
	}

	public String getSublocation() {
		return sublocation;
	}

	public void setSublocation(String sublocation) {
		this.sublocation = sublocation;
	}

	public String getSubparameter() {
		return subparameter;
	}

	public void setSubparameter(String subparameter) {
		this.subparameter = subparameter;
	}

	public String getTimezoneid() {
		return timezoneid;
	}

	public void setTimezoneid(String timezoneid) {
		this.timezoneid = timezoneid;
	}

	public int getTimesoneoffset() {
		return timesoneoffset;
	}

	public void setTimesoneoffset(int timesoneoffset) {
		this.timesoneoffset = timesoneoffset;
	}

	public String getUnits() {
		return units;
	}

	public void setUnits(String units) {
		this.units = units;
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
