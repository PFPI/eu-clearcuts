
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
    let rowCount = finalData.length;
    const lastModDate = baserow.findLastMod(finalData);
    const listOfCountries = countryfxns.listCountries(finalIndex);  
    const finalNavString = fileio.writeMenu(finalIndex);
    // END Getting the data

    // START processing the data into an index and individual point files. 

     console.log("index.js: Full Data has " + rowCount + " rows and a last modified date of " + lastModDate + ".");

     console.log("index.js: There are " + finalIndex.length + " complete records in this database."); 
    
     fileio.writeCutFiles(finalData, finalNavString); //automatically returns a console.log message, you ain't crazy.
    // END Building individual point files. 

    // START building country files. This section could use some clean up!
        listOfCountries.forEach(myCountry => {
          const thisCountrysResults = countryfxns.filterCountry(finalIndex, myCountry);
          const thisCountrysSites = countryfxns.buildSites(thisCountrysResults);
          const thisCountrysCoords = leafletfxns.countryCoords(myCountry);
          fileio.writeCountryFiles(myCountry, finalNavString, thisCountrysSites, thisCountrysCoords);
        });
    // END building country files.

    // START building index page. 
      const finalIndexString = nunjucks.render("index.njk", {navstring: finalNavString, sites: finalData});
      fse.outputFile("build/index.html", finalIndexString, err => { if(err) { console.log(err); } else { }});
      console.log("Finished building index")
    // END building index page. 

}; //end main
//call the main function
main();


// nunjucks.renderString('Hello {{ country }}', { country: asyncApiCall.results.data.Country});

// almost there. get the object and then write the template result (from nunjucks) to a file! do it for each row. Bam. A website. 
// https://mozilla.github.io/nunjucks/api.html