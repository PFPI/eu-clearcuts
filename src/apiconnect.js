const eeafxns = require("./eeafxns");
const brfxns = require("./brfxns");

const main = async() => {

    // load whataver cache we have.
    let currentPolyCache = eeafxns.readPolygonCache();

    console.log("Current cache items: " + currentPolyCache.length);

    console.log(currentPolyCache.length);
    // returns an OBJECT in the probably correct format for our JSON.

let finalIndex = brfxns.buildIndex(brfxns.readCache());
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
            eeafxns.writePolygonCache(currentPolyCache);
        }
    
    });
})


}
main();