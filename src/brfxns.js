const config = require("./config");
const axios = require("axios");
const nunjucks = require("nunjucks");
const fs = require("fs");
const fse = require("fs-extra");
nunjucks.configure('./src/views', { autoescape: false });

// declare module.exports object
let brfxns = {};

brfxns.cleandata = function(myrow){
  if(myrow.LossYr < 2000){
    myrow.LossYr = Number(myrow.LossYr)+2000;
  }
    myrow.myRating = myrow.Rating.value;
    myrow.Image1 = myrow.Images[0].url;
    myrow.Image2 = myrow.Images[1].url;
    myrow.title = myrow.SITECODE + " - " + myrow.FID;
    myrow.buildName = "build/" + myrow.Country + "/" + myrow.SITECODE + "-" + myrow.FID + ".html";
    myrow.indexURL = "/" + myrow.Country + "/" + myrow.SITECODE + "-" + myrow.FID + ".html";
    myrow.indexName = myrow.SITECODE + " - " + myrow.FID;
    return myrow;
};


brfxns.getData = function(page) {
    return axios({
      method: "GET",
      url: config.build.br_base_url + "&page=" + page,
      headers: {
        Authorization: "Token " + config.build.br_token,
      }
    })
  };

brfxns.allData = async function(defPageSize = 100){

    //do the first page separate. 
    let pageNum = 1;
    let finalData = [];
    let firstpage = await this.getData(pageNum);
    var pageData = firstpage.data.results;
    var rowCount = pageData.length;
    if(rowCount > 0){
      console.log("brfxns.allData: Starting page 1 with " + rowCount + " results.")
      finalData = finalData.concat(pageData);
      pageNum += 1;
      //console.log(finalData)
    } else {
      console.log("brfxns.allData: Check your configuration, I couldn't find any results.");
      return finalData;
    }

    // start a while loop for additional pages. 
    console.log("brfxns.allData: Starting the while loop for additional pages.");
    while(rowCount == defPageSize){
      let nextpage = await this.getData(pageNum);
      pageData = nextpage.data.results;
      rowCount = pageData.length;
      console.log("brfxns.allData: Page " + pageNum + " has " + rowCount + " results.")
      if(rowCount > 0){
        finalData = finalData.concat(pageData);
        pageNum += 1;
      } else{
        console.log("brfxns.allData: Page " + pageNum + " had no results.");
        return finalData;
      }
    }
    return finalData;
  }

brfxns.findLastMod = function(finalData){
    //mydata = finalData.filter(myrow => myrow.LastMod > 0);
    const maxValueOfLastMod = finalData.map(function(e) { return e.LastMod; }).sort().reverse()[0]
    return maxValueOfLastMod;
    //return mydata;
 }

brfxns.sameDates = function(dbDate,newDate){
  if(dbDate == newDate){
    return true;
  } else{
    return false;
  }
 }

brfxns.writeCache = function(finalData){
  fs.writeFile('mydbdata.json', JSON.stringify(finalData), (error) => {
    if (error) throw error;
  });
 }

brfxns.readCache = function(){
  const myfile = fs.readFileSync("./mydbdata.json", 'utf8');
  return JSON.parse(myfile);
 }

brfxns.buildIndex = function(finalData){
  let finalIndex = [];
  finalData.forEach(myrow => {
    if(myrow.Complete){
      myrow = this.cleandata(myrow);
      finalIndex.push({url: myrow.indexURL,
                                  country: myrow.Country,
                                  region: myrow.Region,
                                  sitecode: myrow.SITECODE,
                                  name: myrow.indexName,
                                  lat: myrow.POINT_Y,
                                  lon: myrow.POINT_X,
                                  rating: myrow.myRating
                 });
    } //end if complete
  })//end foreach
 return finalIndex;
 } //end fxn

brfxns.returnMenu = function(finalIndex){
    const indexCountries = Array.from(new Set(finalIndex.map(({ country }) => country))).sort();
  const finalNavString = nunjucks.render('header.njk', {finalIndex: indexCountries})
  return finalNavString;
}

brfxns.writeCutFiles = function(finalData, finalNavString){
  let myCount = 1;
  finalData.forEach(myrow => {
    // only work on complete rows
    if(myrow.Complete){
      //clean up sketchy vars
      //console.log("brfxns.writeCutFiles: Complete row " + myrow.FID + " in " + myrow.SITECODE);
      myrow = this.cleandata(myrow);
      //render the HTML
      myrow.finalHTML = nunjucks.render('clearcut.njk', {maincontent: myrow, navstring: finalNavString})
      //write the HTML
      fse.outputFile(myrow.buildName, myrow.finalHTML, err => { if(err) { console.log(err); } else { }});
      myCount += 1;
    } // end if complete

  }); // end foreach
  console.log("brfxns.writeCutFiles: Wrote " + myCount + " clearcut site files to the build directory.");
 }

brfxns.writeCountryFiles = function(myCountry, finalNavString, listRegions, countryCoords){
   let myRenderString = nunjucks.render("country.njk", 
              { country: myCountry, 
                navstring: finalNavString, 
                regions: listRegions,
                coords: countryCoords
              });
  fse.outputFile("build/countries/" + myCountry + ".html", 
                  myRenderString, 
                  err => { if(err) { console.log(err); } else { }});
console.log("brfxns.writeCountryFiles: Processed " + myCountry);
}


module.exports = brfxns;