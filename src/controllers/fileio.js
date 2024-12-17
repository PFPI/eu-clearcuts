const fs = require("fs");
const fse = require("fs-extra");
const baserow = require("./baserow");
const nunjucks = require("nunjucks");

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

 
 fileio.writeCutFiles = function(finalData, finalNavString){
  let myCount = 1;
  finalData.forEach(myrow => {
    // only work on complete rows
    if(myrow.Complete){
      //clean up sketchy vars
      //console.log("fileio.writeCutFiles: Complete row " + myrow.FID + " in " + myrow.SITECODE);
      myrow = baserow.cleanRow(myrow);


      //render the HTML
      myrow.finalHTML = nunjucks.render('clearcut.njk', {maincontent: myrow, navstring: finalNavString})
      //write the HTML
      fse.outputFile(myrow.buildName, myrow.finalHTML, err => { if(err) { console.log(err); } else { }});
      myCount += 1;
    } // end if complete

  }); // end foreach
  console.log("fileio.writeCutFiles: Wrote " + myCount + " clearcut site files to the build directory.");
 }

 fileio.writeCountryFiles = function(myCountry, finalNavString, listRegions, countryCoords){
   let myRenderString = nunjucks.render("country.njk", 
              { country: myCountry, 
                navstring: finalNavString, 
                regions: listRegions,
                coords: countryCoords
              });
  fse.outputFile("build/countries/" + myCountry + ".html", 
                  myRenderString, 
                  err => { if(err) { console.log(err); } else { }});
console.log("fileio.writeCountryFiles: Processed " + myCountry);
}



fileio.writePolygonCache = function(finalData){
  fs.writeFile('mypolygondata.json', JSON.stringify(finalData), (error) => {
    if (error) throw error;
  });
 }

 fileio.readPolygonCache = function(){
  const myfile = fs.readFileSync("./mypolygondata.json", 'utf8');
  return JSON.parse(myfile);
 } 
module.exports = fileio;
