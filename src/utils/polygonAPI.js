const eeafxns = require("../controllers/eeafxns");
const baserow = require("../controllers/baserow");
const fileio = require("../controllers/fileio");


//change the slices to get other polygons. 
const main = async() => {

let finalIndex = baserow.buildIndex(fileio.readCutCache());
let allSitecodes = [...new Set(finalIndex.map(item => item.sitecode))];
console.log(allSitecodes.length);
let subsetSitecodes = allSitecodes.slice(181, 210);
console.log(subsetSitecodes);
subsetSitecodes.forEach(mysitecode => {

    eeafxns.getFromHabitatTable(mysitecode).then(myresults => {
        if(myresults.data.features.length > 0){
            //write file
            eeafxns.writePolygonFile(myresults.data.features, mysitecode);
            console.log(myresults.data.features);
        } else{
            eeafxns.getFromSpeciesTable(mysitecode).then(myresults =>{
                if(myresults.data.features.length > 0){
                    //write file
                    eeafxns.writePolygonFile(myresults.data.features, mysitecode);
                    console.log(myresults.data.features);
                } else{
                    console.log("No file found for sitecode " + mysitecode);
                }
            })
        }
    
    });//end then
}); //end foreach

};
main();