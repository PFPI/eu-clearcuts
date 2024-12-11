// required modules 
 
 
 //declare empty object
 var countryfxns = {};

 countryfxns.listCountries = function(finalIndex){
    var indexCountries = Array.from(new Set(finalIndex.map(({ country }) => country))).sort();
    return indexCountries;
 }

 countryfxns.filterCountry = function(finalIndex, mycountry){
    mydata = finalIndex.filter(fulldatarow => fulldatarow.country === mycountry);
    return mydata;
 }

 countryfxns.listRegions = function(finalIndex){
    var indexRegions = Array.from(new Set(finalIndex.map(({ region }) => region))).sort();
    return indexRegions;
 }

 countryfxns.filterRegion = function(finalIndex, myregion){
    mydata = finalIndex.filter(fulldatarow => fulldatarow.region === myregion);
    return mydata;
 }
 //export to make available elsewhere
 module.exports = countryfxns;