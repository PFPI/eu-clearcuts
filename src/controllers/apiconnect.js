const eeafxns = require("./eeafxns");
const baserow = require("./baserow");
const fileio = require("./fileio");

// This script reads both caches (polygons and finalData) and then goes through the SITECODEs in finalData. 
// If the SITECODE can't be found in the polygon cache, the code asks the API if it exists, 
// and downloads the shapes, and writes to the cache. 

// this script can be run with the command `node ./src/apiconnect.js` but otherwise does not need to be run regularly. 
// there are some variables that need to be altered in order to run - line 24, mostly. 
// The API will rate-limit, so only do the array in batches of 20 or 30. 

const main = async() => {

    // load whataver cache we have.
    let currentPolyCache = fileio.readPolygonCache();

    console.log("Current cache items: " + currentPolyCache.length);

    console.log(currentPolyCache.length);
    // returns an OBJECT in the probably correct format for our JSON.

let finalIndex = baserow.buildIndex(fileio.readCutCache());
let allSitecodes = [...new Set(finalIndex.map(item => item.sitecode))];
console.log(allSitecodes.length);
let subsetSitecodes = allSitecodes.slice(181, 210);
console.log(subsetSitecodes);

subsetSitecodes.forEach(mysitecode => {
    eeafxns.findSitePolygon(mysitecode, true).then(myitem => {

        let lookForData = currentPolyCache.filter(val => val.sitecode.includes(myitem.sitecode) );
        if(lookForData.length > 0){
            console.log("Sitecode: " + mysitecode + " is already in cache.")
        } else{
            console.log("not in cache");
            currentPolyCache.push(myitem);
            console.log("Current cache items: " + currentPolyCache.length);
            fileio.writePolygonCache(currentPolyCache);
        }
    
    });
})


}
main();