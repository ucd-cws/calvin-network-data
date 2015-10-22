# PRM Command Line Tool

## Requirements

### All Systems
- [NodeJS](http://nodejs.org)
  - use apt-get or install from website
- [Java 32-Bit](http://java.com/en/download/manual.jsp)
- [HecDss Java Library](http://www.hec.usace.army.mil/software/hec-dssvue/)
  - The required jars are bundled with HEC-DSSVUE
  - /path/to/install/dir/HEC/HEC-DSSVue/lib;

### Linux / OS X
- [wine](https://www.winehq.org/)
  - Linux: use apt-get or other package manager
  - OS X: use [homebrew](http://brew.sh/)
    - brew install wine

With wine installed, you need to install the 32bit JRE. Ex:
```
wine ~/Downloads/jre-8u65-windows-i586.exe
```

### Calvin HEC Runtime
For your convenience and to reduce pain an suffering, we have created a
package will all required libraries to run the prm tool minus NodeJS.
The package can be found [here](https://github.com/ucd-cws/calvin-network-data/releases) in the releases section.

## Install Node Modules
```
cd /path/to/repo && npm install
```

## Run

```
node prm [command] [arg]
```

### Commands

#### --crawl [directory]
Test crawl a data directory.  Prints the errors, number for nodes/links and number of regions found.

#### --build
Write CSV file(s) to dss file.  Requires the Calvin HEC Runtime (see [releases](https://github.com/ucd-cws/calvin-network-data/releases) section)

Example
```
node prm --build --output ~/out.dss --lib ~/Desktop/HEC_Runtime --csv ~/dev/watershed/calvin-network-data/data/tulare-lake/uplands/sr_scc/costs/APR.csv --month APR --prmname foo --append
 ```

Flags
 - output: full path to output DSS file
 - lib: full path to Calvin HEC Runtime
 - append: must be provided if you are appending to an existing DSS file
 - csv: path to csv file
 - month: for CSS record path
 - prmname: for DSS record path
