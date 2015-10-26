package edu.ucdavis.watershed;

import java.util.LinkedList;

public class CommandLineInput {

	public String path = ""; // dss file path
	public LinkedList<Config> data = null;

	public CommandLineInput() {}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public LinkedList<Config> getData() {
		return data;
	}

	public void setData(LinkedList<Config> data) {
		this.data = data;
	}
}
