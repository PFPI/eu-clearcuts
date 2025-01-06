// required modules 
 let fileio = require("./fileio");
 let leafletfxns = require("./leafletfxns");
 
 //declare empty object
 let countryfxns = {};

 countryfxns.listCountries = function(finalIndex){
   const indexCountries = Array.from(new Set(finalIndex.map(({ country }) => country))).sort();
    return indexCountries;
 }

 countryfxns.filterCountry = function(finalIndex, mycountry){
    mydata = finalIndex.filter(fulldatarow => fulldatarow.country === mycountry);
    return mydata;
 }

 countryfxns.listRegions = function(finalIndex){
    const indexRegions = Array.from(new Set(finalIndex.map(({ region }) => region))).sort();
    return indexRegions;
 }

 countryfxns.filterRegion = function(finalIndex, myregion){
    mydata = finalIndex.filter(fulldatarow => fulldatarow.region === myregion);
    return mydata;
 }

 countryfxns.buildSites = function(filteredIndex){
   // I have a flat array of objects and I need a nested array by Region. 
   //but this is filtered by region already
   const countryName = filteredIndex[0].country;
   //console.log(countryName);
   const allRegions = this.listRegions(filteredIndex);
   let finalBuiltSites = [];
   allRegions.forEach(myregion => {
      const updatedIndex = this.filterRegion(filteredIndex, myregion);
      finalBuiltSites.push({ 
                             region: myregion,
                              sites: updatedIndex
                           });
   })
   //console.dir(finalBuiltSites);
   return finalBuiltSites;
 }

countryfxns.buildCountryFiles = function(listOfCountries, finalIndex, finalNavString){
        listOfCountries.forEach(myCountry => {
          const thisCountrysResults = this.filterCountry(finalIndex, myCountry);
          const thisCountrysSites = this.buildSites(thisCountrysResults);
          const thisCountrysCoords = leafletfxns.countryCoords(myCountry);
          fileio.writeCountryFiles(myCountry, finalNavString, thisCountrysSites, thisCountrysCoords);
        });

}


 //export to make available elsewhere
 module.exports = countryfxns;