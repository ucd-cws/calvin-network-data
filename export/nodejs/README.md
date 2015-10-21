# PRM Command Line Tool

## Requirements

### All Systems
- [NodeJS](http://nodejs.org)
  - use apt-get or install from website
- [Java 32-Bit](http://java.com/en/download/manual.jsp)
- [HecDss Java Library](http://www.hec.usace.army.mil/software/hec-dssvue/)
  - The required jars are bundled with HEC-DSSVUE

### Linux / OSx
- [wine](https://www.winehq.org/)
  - Linux: use apt-get or other package manager
  - OSx: use [homebrew](http://brew.sh/)
    - brew install wine

## Run

```
node prm [command] [arg]
```

### Commands

#### --crawl [directory]
Test crawl a data directory.  Prints the errors, number for nodes/links and number of regions found.
