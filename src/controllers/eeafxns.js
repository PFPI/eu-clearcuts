const axios = require("axios");
const fs = require("fs");
let eeafxns = {};

// https://bio.discomap.eea.europa.eu/arcgis/rest/services/ProtectedSites/Natura2000Sites/MapServer/0/query?where=SITECODE%3D%27SI3000337%27&text=&objectIds=&time=&timeRelation=esriTimeRelationOverlaps&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&returnExtentOnly=false&sqlFormat=none&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=pjson

eeafxns.getFromHabitatTable = function(sitecode){
        return axios({
          method: "GET",
          url: "https://bio.discomap.eea.europa.eu/arcgis/rest/services/ProtectedSites/Natura2000Sites/MapServer/0/query?where=SITECODE%3D%27" + sitecode + "%27&text=&objectIds=&time=&timeRelation=esriTimeRelationOverlaps&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&returnExtentOnly=false&sqlFormat=none&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=pjson",
          headers: {}
        })
}

eeafxns.getFromSpeciesTable = function(sitecode){
  return axios({
    method: "GET",
    url: "https://bio.discomap.eea.europa.eu/arcgis/rest/services/ProtectedSites/Natura2000Sites/MapServer/1/query?where=SITECODE%3D%27" + sitecode + "%27&text=&objectIds=&time=&timeRelation=esriTimeRelationOverlaps&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&returnExtentOnly=false&sqlFormat=none&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=pjson",
    headers: {}
  })
}

eeafxns.findSitePolygon = async function(sitecode, verbose=false){
  //load Cache
  let starterCache = [];
 //try habitat table
  await this.getFromHabitatTable(sitecode).then(myresults => {
      if(myresults.data.features.length > 0){
        console.log("Habitat Table Success!")
        starterCache.push({sitecode: sitecode, shape: myresults.data.features[0].geometry.rings})
      }
  });
  if(starterCache.length > 0){
    return starterCache[0];
  } else {
  await this.getFromSpeciesTable(sitecode).then(myresults => {
    if(myresults.data.features.length > 0){
      console.log("Species Table Success!")
      starterCache.push({sitecode: sitecode, shape: myresults.data.features[0].geometry.rings})
    }
  });
  } // end else
 return starterCache[0];

}