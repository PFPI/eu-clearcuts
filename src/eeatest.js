const eeafxns = require("./eeafxns");
const brfxns = require("./brfxns");

const main = async() => {
    console.log("Testing Habitats Code");
    eeafxns.findSitePolygon("SI3000337", true);
    console.log("Testing Species Code");
    eeafxns.findSitePolygon("AT1125129", true);
    console.log("Testing Both Code");
    eeafxns.findSitePolygon("AT2112000", true);
    console.log("Testing Bad Code");
    eeafxns.findSitePolygon("ThisSite", true);

    /// get a list of all the country codes
    /// read in dataCache
    let finalData = brfxns.readCache();
    let finalIndex = brfxns.buildIndex(finalData);
    let allSitecodes = [...new Set(finalIndex.map(item => item.sitecode))];
    console.log(allSitecodes);

    let n2kPolygons = [];
    //for each country code (but do a few only)
    let slicedSiteCodes = allSitecodes.slice(0, 5);
        slicedSiteCodes.forEach(mysitecode => {
            n2kPolygons.push({sitecode: mysitecode, shape: eeafxns.findSitePolygon(mysitecode)});
        })
        console.log(n2kPolygons);
        brfxns.writePolygonCache(n2kPolygons);
        //get the polygons
        //store them in an array
}
main();