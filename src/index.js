
// load required files
const nunjucks = require("nunjucks");
const countryfxns = require("./controllers/countryfxns");
const leafletfxns = require("./controllers/leafletfxns");
const baserow = require("./controllers/baserow");
const fileio = require("./controllers/fileio");
const fse = require('fs-extra');
const args = process.argv.slice(2);
nunjucks.configure('./src/views', { autoescape: false });
console.log("Success!")

// start our MAIN function, in which everything will happen "in order" even though its asynchronous
const main = async() => {

  // START Getting the data, whether cached or fresh. if you need to get fresh data, comment/uncomment to swap the commands. 
  let finalData = fileio.readCutCache();
  if(args[0]){
      console.log("I'm rebuilding the cache.")
      finalData = await baserow.getAllData();
      fileio.writeCutCache(finalData);
    }
    const finalIndex = baserow.buildIndex(finalData);
    const listOfCountries = countryfxns.listCountries(finalIndex);  
    const finalNavString = fileio.writeMenu(finalIndex);
    // END Getting the data

    // READ OUT STATISTICS
     console.log("index.js: Full Data has " + finalData.length + " rows and a last modified date of " + 
      baserow.findLastMod(finalData) + ". There are " + finalIndex.length + " complete records in this database."); 
    
        // START processing the data into an index and individual point files. 
     fileio.writeCutFiles(finalData, finalNavString);
     countryfxns.buildCountryFiles(listOfCountries, finalIndex, finalNavString);

      const finalIndexString = nunjucks.render("index.njk", {navstring: finalNavString, sites: finalData});
      fse.outputFile("build/index.html", finalIndexString, err => { if(err) { console.log(err); } else { }});
      console.log("Finished building index")
    // END building pages. 

}; //end main
//call the main function
main();


// nunjucks.renderString('Hello {{ country }}', { country: asyncApiCall.results.data.Country});

// almost there. get the object and then write the template result (from nunjucks) to a file! do it for each row. Bam. A website. 
// https://mozilla.github.io/nunjucks/api.html