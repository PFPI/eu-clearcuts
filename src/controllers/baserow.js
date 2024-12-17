const config = require("../config");
const axios = require("axios");
const nunjucks = require("nunjucks");
nunjucks.configure('./src/views', { autoescape: false });

// declare module.exports object
let baserow = {};


// row cleanup section
baserow.cleanRow = function(myrow){
  this.convertYear(myrow.LossYr)
    myrow.myRating = this.getRating(myrow);
    myrow.Image1 = this.getImageURL(myrow, 0);
    myrow.Image2 = this.getImageURL(myrow, 1);
    myrow.title = this.getRowTitle(myrow);
    myrow.buildName = this.getBuildPath(myrow);
    myrow.indexURL = this.getIndexPath(myrow);
    return myrow;
};

// cleanRow subfunctions
baserow.convertYear = function(year){
    if(year < 2000){
        return year + 2000;
    } else{
        return year;
    }
}

baserow.getRating = function(myrow){
    return myrow.Rating.value;
}

baserow.getImageURL = function(myrow, id){
    return myrow.Images[id].url;
}
baserow.getRowTitle = function(myrow){
    return myrow.SITECODE + " - " + myrow.FID;
}
baserow.getBuildPath = function(myrow){
    return "build/" + myrow.Country + "/" + myrow.SITECODE + "-" + myrow.FID + ".html";
}
baserow.getIndexPath = function(myrow){
    return "/" + myrow.Country + "/" + myrow.SITECODE + "-" + myrow.FID + ".html";
}



  // API functions
baserow.getPageData = function(page) {
    return axios({
      method: "GET",
      url: config.build.br_base_url + "&page=" + page,
      headers: {
        Authorization: "Token " + config.build.br_token,
      }
    })
  };

baserow.getAllData = async function(defPageSize = 100, verbose=true){

    //do the first page separate, because there should always be a page 1.  
    let pageNum = 1;
    let finalData = [];
    let firstpage = await this.getPageData(pageNum);
    var pageData = firstpage.data.results;
    var rowCount = pageData.length;
    if(rowCount > 0){
      if(verbose){console.log("baserow.allData: Starting page 1 with " + rowCount + " results.");}
      finalData = finalData.concat(pageData);
      pageNum += 1;
    } else {
        if(verbose){console.log("baserow.allData: Check your configuration, I couldn't find any results.");}
      return finalData;
    }

    // start a while loop for additional pages. 
    if(verbose){console.log("baserow.allData: Starting the while loop for additional pages.");}
    while(rowCount == defPageSize){
      let nextpage = await this.getPageData(pageNum);
      pageData = nextpage.data.results;
      rowCount = pageData.length;
      if(verbose){console.log("baserow.allData: Page " + pageNum + " has " + rowCount + " results.");}
      if(rowCount > 0){
        finalData = finalData.concat(pageData);
        pageNum += 1;
      } else{
        if(verbose){console.log("baserow.allData: Page " + pageNum + " had no results.");}
        return finalData;
      }
    }
    return finalData;
  }

//date functions
baserow.findLastMod = function(finalData){
    //mydata = finalData.filter(myrow => myrow.LastMod > 0);
    const maxValueOfLastMod = finalData.map(function(e) { return e.LastMod; }).sort().reverse()[0]
    return maxValueOfLastMod;
    //return mydata;
 }

 baserow.sameDates = function(dbDate,newDate){
  if(dbDate == newDate){
    return true;
  } else{
    return false;
  }
 }


// index functions
baserow.buildIndex = function(finalData){
  let finalIndex = [];
  finalData.forEach(myrow => {
    if(myrow.Complete){
      myrow = this.cleanRow(myrow);
      finalIndex.push({url: myrow.indexURL,
                                  country: myrow.Country,
                                  region: myrow.Region,
                                  sitecode: myrow.SITECODE,
                                  name: myrow.title,
                                  lat: myrow.POINT_Y,
                                  lon: myrow.POINT_X,
                                  rating: myrow.myRating
                 });
    } //end if complete
  })//end foreach
 return finalIndex;
 } //end fxn




module.exports = baserow;