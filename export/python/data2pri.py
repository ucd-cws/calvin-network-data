import os
import sys
import json

data = dict()
data["node"] = dict()
data["link"] = dict()

def loadDataDirectory(dirPath):
    '''
    Given the directory path to where the 
    network tree is stored, this will traverse
    through the directory and grab all of the
    geojson files.
    '''
    for dirName, subDir, fileList in os.walk(dirPath):
        for fileName in fileList:
            if "json" in fileName:
                absPath = os.path.join(dirName, fileName)
                loadGeojson(absPath)

def loadGeojson(path):
    '''
    Opens given geojson file
    Checks the contents of the json file
    Sorts it by the type of content by storing it into
    a dict
    '''
    geofile = None
    geodata = None

    try:
        geofile = open(path, 'r')
        geodata = json.load(geofile)
    except Exception as e:
        print("{} does not exist or JSON file failed to parse\n{}\e".format(path,e))
    
    if not geodata:
        return
    if not "properties" in geodata:
        return
    if not "prmname" in geodata["properties"]:
        return

    #set directory path of geojson file to get csv files
    geodata["dirpath"] = os.path.dirname(path)
    # #set directory path of csv/other files related to geojson file
    # geodata["geofolder"] = os.path.join(geodata["dirpath"], geofolder)

    if geodata["properties"]["type"] in ['Diversion', 'Return Flow']:
        data["link"][geodata["properties"]["prmname"]] = geodata
    else:
        data["node"][geodata["properties"]["prmname"]] = geodata


def generatePRI():
    
    result = ''
    result += '..       ***** NODE DEFINITIONS *****\n'
    result += '..       \n'
    result += nodeData()

    result += '..       \n'
    result += '..       \n'
    result += '..       \n'
    result += 'LINK     DIVR     SOURCE    SINK    1.000    0.00\n'
    result += 'LD     Continuity Link\n'
    result += '..       \n'

    result += '..       ***** INFLOW DEFINITIONS *****\n'
    result += '..       \n'
    result += inflowData()
    result += '..       \n'

    result += '..       ***** STORAGE LINK DEFINITIONS *****\n'
    result += '..       \n'
    result += rstoData()

    result += divrData()
    result += "STOP\n"

    return result

def nodeData():
    nodeOutput = ''
    nodeSorted = data["node"].keys()
    nodeSorted.sort()

    for node in nodeSorted:
        geojson = data["node"][node]
        
        name = geojson["properties"]["prmname"]
        desc = geojson["properties"]["description"]
        initStorage = ''
        endStorage = ''
        areaCapFactor = ''

        if "initialstorage" in geojson["properties"]:
            initStorage = geojson["properties"]["initialstorage"]
        if "endingstorage" in geojson["properties"]:
            endStorage = geojson["properties"]["endingstorage"]
        if "areacapfactor" in geojson["properties"]:
            initStorage = geojson["properties"]["areacapfactor"]        

        nodeOutput += "NODE     {} {} {} {}\n".format(name, initStorage, areaCapFactor, endStorage)
        nodeOutput += "ND       {}\n".format(desc)
        nodeOutput += "..         \n"

    return nodeOutput

def inflowData():
    inflowOutput = ''
    inflowSorted = data["node"].keys()
    inflowSorted.sort()

    for inflow in inflowSorted:
        geojson = data["node"][inflow]

        if not "inflows" in geojson["properties"] or not geojson["properties"]["inflows"]:
            continue

        name = geojson["properties"]["prmname"]

        desc = geojson["properties"]["inflows"]["default"]["description"]
        
        inflowOutput += "LINK      {:<10}{:<10}{:<10}{:<10}{:<10}\n".format("INFL","SOURCE", name, "1.000","0.00")
        #inflowOutput += "LINK      INFL      SOURCE    {}   1.000     0.00\n".format(name)
        inflowOutput += "LD        {}\n".format(desc)
        inflowOutput += "IN        A={} B={} C={} E={} F={}\n".format("","SOURCE_" + name, "FLOW_LOC(KAF)", "1MON", "")
        inflowOutput += "..        \n"
        
    return inflowOutput

def rstoData():
    rstoOutput = ''
    rstoSorted = data["node"].keys()
    rstoSorted.sort()

    for rsto in rstoSorted:
        geojson = data["node"][rsto]

        if not geojson["properties"]["type"] in ["Surface Storage", "Groundwater Storage"]:
            continue    

        name = geojson["properties"]["prmname"]
        desc = geojson["properties"]["description"]
        costs = geojson["properties"]["costs"]

        bounds = ''
        if "bounds" in geojson["properties"]:
            bounds = geojson["properties"]["bounds"]

        boundTable = getBounds(geojson)

        lowerConst = boundTable["lowerConst"]
        upperConst = boundTable["upperConst"]
        BL = boundTable["BL"]
        BU = boundTable["BU"]
        QL = boundTable["QL"]
        QU = boundTable["QU"]
        EV = ''
        PS = ''
        LD = "LD        {}\n".format(desc)

        link = "LINK      {:<10}{:<10}{:<10}{:<10}{:<10}{:<10}\n".format("RSTO",name, name, "1.000",lowerConst,upperConst)

        #COSTS
        if costs["type"] == "Monthly Variable":
            EV = "EV        A={} B={} C={} F={}\n".format("",name,"EVAP_RATE(FT)", desc)
            for month in ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"]:
                PS += "PS        MO={} A={} B={} C={} D={} E={} F={}\n".format(month,"UCD CAP1", name, "Q(K$-KAF)-P","",month,"")
        elif costs["type"] == "Annual Variable":
            monthLabel = "JAN-DEC"
            PS = "PS        MO={} A={} B={} C={} D={} E={} F={}\n".format(monthLabel,"UCD CAP1","DUMMY","Q(K$-KAF)-P","","", "")
        else: #All variables
            PS = "PS        MO={} A={} B={} C={} D={} E={} F={}\n".format("ALL","UCD CAP1","DUMMY","BLANK","","", "")
        
        QI = "QI        A={} B={} C={} D={} E={} F={}\n".format("", name, "STOR", "", "1MON", "")

        rstoOutput += link + LD + QL + QU + BL + BU + EV + PS + QI + "..      \n"

    return rstoOutput

def getBounds(geojson):
    boundsTable = dict()
    boundsTable["lowerConst"] = ''
    boundsTable["upperConst"] = ''
    boundsTable["BU"] = ''
    boundsTable["BL"] = ''
    boundsTable["QL"] = ''
    boundsTable["QU"] = ''

    boundsList = geojson["properties"]["bounds"]

    for bounds in boundsList:

        #list , months 
        if bounds["type"] in ["LBM","UBM"]:
            filename = "{}.csv".format(bounds["type"])
            filepath = os.path.join(geojson["dirpath"], filename)
            boundscsv = open(filepath, 'r')
            boundslist = []
            for line in boundscsv:
                line = line.strip()
                splitdata = line.split(",")
                if splitdata[0] in ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"]:
                    boundslist.append(splitdata[1])
            
            mboundkey = "BU"
            if bounds["type"] == "LBM":
                mboundkey = "BL"

            boundsTable[mboundkey] = "{}        {}\n".format(mboundkey, ','.join(boundslist))


        #constants
        if bounds["type"] == "LBC":
            boundsTable["lowerConst"] = bounds["bound"]
        if bounds["type"] == "UBC":
            boundsTable["upperConst"] = bounds["bound"]

        #Time Series 
        if bounds["type"] == "LBT":
            boundsTable["QL"] = "QL        A={} B={} C={} D={} E={} F={}\n".format("",geojson["properties"]["prmname"], "STOR_LBC(KAF)","", "1MON", geojson["properties"]["description"])
        if bounds["type"] == "UBT":
            boundsTable["QU"] = "QU        A={} B={} C={} D={} E={} F={}\n".format("",geojson["properties"]["prmname"], "STOR_LBC(KAF)","", "1MON", geojson["properties"]["description"])


    return boundsTable

def divrData():
    divrOutput = ''
    divrSorted = data["link"].keys()
    divrSorted.sort()

    for divr in divrSorted:
        geojson = data["link"][divr]

        if geojson["properties"]["type"] != "Diversion":
            continue 
            
        name      = geojson["properties"]["prmname"]
        origin    = geojson["properties"]["origin"]
        terminus = geojson["properties"]["terminus"]
        amplitude = geojson["properties"]["amplitude"]
        desc      = geojson["properties"]["description"]

        bounds = ''
        if "bounds" in geojson["properties"]:
            bounds = geojson["properties"]["bounds"]

        boundTable = getBounds(geojson)

        lowerConst = boundTable["lowerConst"]
        upperConst = boundTable["upperConst"]
        BL = boundTable["BL"]
        BU = boundTable["BU"]
        QL = boundTable["QL"]
        QU = boundTable["QU"]
   
        costTable = getCosts(geojson)
        cost = costTable["cost"]
        PQ = costTable["PQ"]

        QI = "QI        A={} B={} C={} D={} E={} F={}\n".format("", name, "FLOW_DIV(KAF)", "", "1MON", "")

        link = "LINK      {:<10}{:<10}{:<10}{:<10}{:<10}\n".format("DIVR",origin, terminus, amplitude, cost, lowerConst, upperConst)
        LD = "{:<10}{}\n".format("LD",desc)
        
        divrOutput += link + LD + QL + QU + BL + BU + PQ + QI + "..      \n"

    return divrOutput

def getCosts(geojson):
    costTable = dict()
    costTable["cost"] = ''
    costTable["PQ"] = ''
    costTable["QI"] = ''

    if not "costs" in geojson["properties"]:
        return costTable

    origin    = geojson["properties"]["origin"]
    terminus = geojson["properties"]["terminus"]
    costs = geojson["properties"]["costs"]
    
    
    if "cost" in costs:
        costTable["cost"] = costs["cost"]


    if costs["type"] == "Monthly Variable":
        PQ = ''
        for month in ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"]:
            PQ += "{:<10}MO={} A={} B={} C={} D={} E={} F={}\n".format("PQ", month, "", origin + "_" + terminus, "Q(K$-KAF)", "", month, "", "")
        costTable["PQ"] = PQ
    else:
        costTable["PQ"] = "{:<10}MO={} A={} B={} C={} D={} E={} F={}\n".format("PQ", "ALL", "", "DUMMY", "BLANK", "", "", "", "")
    
    return costTable



if __name__ == '__main__':
    if len(sys.argv) == 2:
        loadDataDirectory(sys.argv[1])
        #print(generatePRI())
        # print(nodeData())
        # print(inflowData())
        # print(rstoData())
        print(divrData())

