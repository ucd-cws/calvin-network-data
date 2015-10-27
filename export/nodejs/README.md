# PRM Command Line Tool

The ```prm``` command line tool allows users to prepare their calvin-network-data for running the HEC-PRM model code.
The HEC-PRM code is distributed as a windows binary.   Further, HEC-PRM uses DSS formatted files as input.  We use the DSSVUE software to transfer data into and out of the DSS format.  While, DSSVue is written in JAVA, precompiled libraries for this package only work in the Windows environment.  For these two reasons, if you are running this software on MacOS or Linux, you will need to run a Windows emulator, like wine.


## Requirements

### All Systems
- [NodeJS](http://nodejs.org)
  - use apt-get or install from website
- [Java 32-Bit](http://java.com/en/download/manual.jsp)
- [HecDss Java Library](http://www.hec.usace.army.mil/software/hec-dssvue/)
  - The required jars are bundled with HEC-DSSVUE
  - /path/to/install/dir/HEC/HEC-DSSVue/lib;

These requirements have been bundled into a [windows runtime](#calvin-hec-runtime).  The command
line tool will automatically run the java code via wine in OS X and Linux.  So make sure you
have wine installed if you are not using windows.

### Linux / OS X
- [wine](https://www.winehq.org/)
  - Linux: use apt-get or other package manager
  - OS X: use [homebrew](http://brew.sh/)
    - brew install wine

### Calvin HEC Runtime
For your convenience and to reduce pain and suffering, we have created a
package with all required libraries to run the prm tool minus NodeJS (and wine).
The package can be found [here](https://github.com/ucd-cws/calvin-network-data/releases) in the releases section.

Currently this runtime is REQUIRED to run the **build** command.  You need to
download and unzip the package.  Then specify the path to the unzipped folder in **build** using the *--runtime* flag.

## Install Node Modules
```
cd /path/to/repo && npm install
```

## Run

```
node prm [command] [arg]
```

### .prmconf file
All arguments for prm commands can be passed via command line parameter or stored in a JSON formatted .prmconf file.
This file should be stored in your accounts home directory be default.  If you
wish to supply a config file that is not located in your home directory, you can
do so with --config [path/to/config/file] parameter.

## Commands

### crawl [directory]
Test crawl a data directory.  Prints the errors, number for nodes/links and number of regions found.

### build [prefix] --runtime [/path/to/hec/runtime] --data [/path/to/data/repo]
Write CSV file(s) to dss file.  Requires the Calvin HEC Runtime (see [releases](https://github.com/ucd-cws/calvin-network-data/releases) section)

Example
```
node prm build out --runtime ~/Desktop/HEC_Runtime --data ~/dev/calvin-network-data/data
 ```

Optionally you can add *--verbose* to dump the hec-dss libraries output.

### node [show|list] [prmname] [prmname] ...

#### node show [prmname] [prmname]
Print a list of nodes as they are represented in the pri files.

#### node list
Print all nodes.  Format:
prmname,/full/path/to/file

### link [show|list] [prmname] [prmname] ...

#### link show [prmname] [prmname]
Print a list of links as they are represented in the pri files.

#### links list
Print all links.  Format:
prmname,/full/path/to/file

### DSSVUE

You will most likely want to review your DSS files from time to time.  [HEC-DSSVue](http://www.hec.usace.army.mil/software/hec-dssvue/) is the most common software for that.  The download section of the [HEC-DSSVue](http://www.hec.usace.army.mil/software/hec-dssvue/) includes a windows and a linux version available for download.

For linux, if you have root access, consider unzipping the hec-dssvue201 directory int ```/usr/local/lib```, and copying the hec-dssvue.sh file to ```/usr/local/bin/dssvue```, with the proper modification of ```PROG_ROOT```.  This allows access to the program for all users.  A few other minor tweaks seem to be required.

```
$ diff -u1 /usr/local/lib/hec-dssvue201/hec-dssvue.sh /usr/local/bin/dssvue
--- /usr/local/lib/hec-dssvue201/hec-dssvue.sh	2013-12-06 07:38:29.244310551 -0800
+++ /usr/local/bin/dssvue	2015-10-22 15:52:52.451576726 -0700
@@ -6,3 +6,3 @@
 then
-	if [[ "$1" =~ .*\.py ]]
+	if [[ "$1" =~ "*.py" ]]
 	then
@@ -36,3 +36,3 @@
 # PROG_ROOT=/usr/local/hec/hec-dssvue
-PROG_ROOT=.
+PROG_ROOT=/usr/local/lib/hec-dssvue201
 JAVA_EXE=$PROG_ROOT/java/bin/java
@@ -48,3 +48,3 @@
 -DLOGFILE=$APPDATA/logs/hec-dssvue.log \
--Dpython.path=$PROG_ROOT/jar/sys/jythonlib.jar/lib:jar/sys/jythonUtils.jar \
+-Dpython.path=$PROG_ROOT/jar/sys/jython.jar/Lib \
 -Dpython.home=$APPDATA/pythonHome \
@@ -56,5 +56,4 @@
 -DCWMS_EXE=$PROG_ROOT \
--DPLUGINS=$PROG_ROOT/plugins \
 -Djava.security.policy=$PROG_ROOT/config/java.policy \
--cp $JARDIR/*:$JARDIRSYS/*:$JARDIRHELP/*:plugins/* \
+-cp $JARDIR/*:$JARDIRSYS/*:$JARDIRHELP/*:${PROG_ROOT}/plugins/* \
 hec.dssgui.HecDssVue $* \
```
