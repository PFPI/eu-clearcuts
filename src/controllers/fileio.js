const fs = require("fs");
const fse = require("fs-extra");
const baserow = require("./baserow");
const nunjucks = require("nunjucks");
const cutRecords = require("./cutRecords");

let fileio = {};

fileio.writeCutCache = function (finalData) {
  fs.writeFile('mydbdata.json', JSON.stringify(finalData), (error) => {
    if (error) throw error;
  });
};

fileio.readCutCache = function(){
  try{
  const myfile = fs.readFileSync("./mydbdata.json", 'utf8');
  return JSON.parse(myfile);
  } catch (error){
    console.error("An error occured: ", error);
  }
  
 }

 fileio.writeMenu = function(finalIndex){
  const indexCountries = Array.from(new Set(finalIndex.map(({ country }) => country))).sort();
  const finalNavString = nunjucks.render('header.njk', {finalIndex: indexCountries})
  return finalNavString;
}

 
 fileio.writeCutFiles = function(finalData, finalNavString, verbose=false){
  let myCount = 0; // for verbose functioning only
  finalData.forEach(myrow => { 
    if(myrow.Complete){ // only work on complete rows
      if(verbose){ console.log("Starting fileio.writeCutFiles: " + myrow.FID + "  in " + myrow.SITECODE + ".")}
      myrow = baserow.cleanRow(myrow); //clean up sketchy vars
      let polygonCache = this.readPolygonCache(myrow.SITECODE); //get the site polygon
      let clearcutStats = cutRecords.getCutHA(myrow.SITECODE)//get the clearcut statistics
      let siteStats = cutRecords.getTotalHA(myrow.SITECODE); // get the site statistics
      let siteCutData = cutRecords.getCutTable(myrow.SITECODE); // get the table for the graph. 
      myrow.finalHTML = nunjucks.render('clearcut.njk', {graphdata: siteCutData, maincontent: myrow, navstring: finalNavString, n2kPolygon: JSON.stringify(polygonCache), clearcutHA: clearcutStats, siteHA: siteStats}) //generate the HTML
      fse.outputFile(myrow.buildName, myrow.finalHTML, err => { if(err) { console.log(err); } else { }}); //write the HTML file
      myCount += 1; // for verbose functioning only.
    } // end if complete
  }); // end foreach
  if(verbose){console.log("fileio.writeCutFiles: Wrote " + myCount + " clearcut site files to the build directory.");}
 }

 fileio.writeCountryFiles = function(thisCountry, finalNavString, listRegions, countryCoords){
   let myRenderString = nunjucks.render("country.njk", 
              { country: thisCountry, 
                navstring: finalNavString, 
                regions: listRegions,
                coords: countryCoords
              });
  fse.outputFile("build/countries/" + thisCountry + ".html", 
                  myRenderString, 
                  err => { if(err) { console.log(err); } else { }});
console.log("fileio.writeCountryFiles: Processed " + thisCountry);
}



fileio.writePolygonCache = function(finalData){
  fs.writeFile('mypolygondata.json', JSON.stringify(finalData), (error) => {
    if (error) throw error;
  });
 }

 fileio.readPolygonCache = function(sitecode){
  try{
    const myfile = fs.readFileSync("./src/data/" + sitecode + ".json", 'utf8');
    return JSON.parse(myfile);
  } catch (error){
    console.error("An error occured: ", error);
    return [];
  }
 } 


 fileio.getPolygon = function(myCache, inSitecode, verbose=true){
  if(verbose){console.log("Getting "+ inSitecode);}
  let results = myCache.filter(item => item.sitecode == inSitecode);
  if(results.length > 0){
    return results[0];
  } else{
    return [];
  }
 }



module.exports = fileio;
