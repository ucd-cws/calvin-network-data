package edu.ucdavis.watershed;

import java.util.ArrayList;
import java.util.List;

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
	public int numberCurves = 1;


	public int startTime = 0;
	public int endTime = 0;
	public int interval = 43200; // Approx hrs in a month
	public String parameter = null; //partE;
	public List<Integer> quality = new ArrayList<Integer>();
	public String subLocation = "";
	public String subParameter = "";
	public String timeZoneID = "None";
	public int timeZoneRawOffset = 0;
	public String units = "";

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

	public int getNumberCurves() {
		return numberCurves;
	}

	public void setNumberCurves(int numberCurves) {
		this.numberCurves = numberCurves;
	}

	public int getStartTime() {
		return startTime;
	}

	public void setStartdate(int startTime) {
		this.startTime = startTime;
	}

	public int getEndTime() {
		return endTime;
	}

	public void setEndTime(int endTime) {
		this.endTime = endTime;
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

	public List<Integer> getQuality() {
		return quality;
	}

	public void setQuality(List<Integer> quality) {
		this.quality = quality;
	}

	public String getSubLocation() {
		return subLocation;
	}

	public void setSubLocation(String subLocation) {
		this.subLocation = subLocation;
	}

	public String getSubParameter() {
		return subParameter;
	}

	public void setSubParameter(String subParameter) {
		this.subParameter = subParameter;
	}

	public String getTimeZoneID() {
		return timeZoneID;
	}

	public void setTimezoneid(String timeZoneID) {
		this.timeZoneID = timeZoneID;
	}

	public int getTimeZoneRawOffset() {
		return timeZoneRawOffset;
	}

	public void setTimesoneoffset(int timeZoneRawOffset) {
		this.timeZoneRawOffset = timeZoneRawOffset;
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
