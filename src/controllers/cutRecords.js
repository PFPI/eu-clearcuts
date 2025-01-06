const fs = require("fs");
let cutRecords = {};

cutRecords.readCutRecordsCache = function(verbose=false){
    try{
      const myfile = fs.readFileSync("./src/data/output.json", 'utf8');
      const parsed_file = JSON.parse(myfile)
      //console.log("Loaded cache with " + Object.keys(parsed_file).length + " rows.")
      //console.log(parsed_file[0].sitecode);
      return parsed_file;
    } catch (error){
      console.error("An error occured: ", error);
      return [];
    }
   } 
   
cutRecords.getRecord = function(sitecode){
    let myRecords = this.readCutRecordsCache();
    return myRecords.filter((record) => record.sitecode == sitecode)[0];
}

cutRecords.getCutYearHA = function(sitecode, year){
     let myFilterSite = this.getRecord(sitecode);
     let percentInYear = myFilterSite["perc"+year];
     let totalHA = myFilterSite['totalha'];
     let haCutInYear = percentInYear*totalHA;
     
     return haCutInYear;
}

cutRecords.getCutTable = function(sitecode){
    let finalArray = [];
    let myFilterSite = this.getRecord(sitecode);
    if(typeof myFilterSite !== 'undefined'){
        finalArray.push({ x: 2001, y: myFilterSite["perc2001"] * myFilterSite["totalha"]});
        finalArray.push({ x: 2002, y: myFilterSite["perc2002"] * myFilterSite["totalha"]})
        finalArray.push({ x: 2003, y: myFilterSite["perc2003"] * myFilterSite["totalha"]})
        finalArray.push({ x: 2004, y: myFilterSite["perc2004"] * myFilterSite["totalha"]})
        finalArray.push({ x: 2005, y: myFilterSite["perc2005"] * myFilterSite["totalha"]})
        finalArray.push({ x: 2006, y: myFilterSite["perc2006"] * myFilterSite["totalha"]})
        finalArray.push({ x: 2007, y: myFilterSite["perc2007"] * myFilterSite["totalha"]})
        finalArray.push({ x: 2008, y: myFilterSite["perc2008"] * myFilterSite["totalha"]})
        finalArray.push({ x: 2009, y: myFilterSite["perc2009"] * myFilterSite["totalha"]})
        finalArray.push({ x: 2010, y: myFilterSite["perc2010"] * myFilterSite["totalha"]})
        finalArray.push({ x: 2011, y: myFilterSite["perc2011"] * myFilterSite["totalha"]})
        finalArray.push({ x: 2012, y: myFilterSite["perc2012"] * myFilterSite["totalha"]})
        finalArray.push({ x: 2013, y: myFilterSite["perc2013"] * myFilterSite["totalha"]})
        finalArray.push({ x: 2014, y: myFilterSite["perc2014"] * myFilterSite["totalha"]})
        finalArray.push({ x: 2015, y: myFilterSite["perc2015"] * myFilterSite["totalha"]})
        finalArray.push({ x: 2016, y: myFilterSite["perc2016"] * myFilterSite["totalha"]})
        finalArray.push({ x: 2017, y: myFilterSite["perc2017"] * myFilterSite["totalha"]})
        finalArray.push({ x: 2018, y: myFilterSite["perc2018"] * myFilterSite["totalha"]})
        finalArray.push({ x: 2019, y: myFilterSite["perc2019"] * myFilterSite["totalha"]})
        finalArray.push({ x: 2020, y: myFilterSite["perc2020"] * myFilterSite["totalha"]})
        finalArray.push({ x: 2021, y: myFilterSite["perc2021"] * myFilterSite["totalha"]})
        finalArray.push({ x: 2022, y: myFilterSite["perc2022"] * myFilterSite["totalha"]})
        finalArray.push({ x: 2023, y: myFilterSite["perc2023"] * myFilterSite["totalha"]})
    }
    return finalArray;
}

cutRecords.getCutHA = function(sitecode, verbose=false){
    let myFilterSite = this.getRecord(sitecode);
    let percLogged = 0;
    let totalHA = 0;
    let totalCutHA = 0;
    if(typeof myFilterSite !== 'undefined'){
        percLogged = myFilterSite['perclogged'];
        totalHA = myFilterSite['totalha'];
        if(verbose){console.log("percLogged is " + percLogged + " and totalHA is " + totalHA );}
        totalCutHA = percLogged * totalHA;
    }
    return totalCutHA;
}

cutRecords.getTotalHA = function(sitecode){
    let myFilterSite = this.getRecord(sitecode);
    let totalHA = 0;
    if(typeof myFilterSite !== 'undefined'){
        totalHA = myFilterSite['totalha'];
    }
    return totalHA;
}


module.exports = cutRecords;