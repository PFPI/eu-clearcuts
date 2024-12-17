// required modules 
 
 
 //declare empty object
 let leafletfxns = {};

leafletfxns.countryCoords = function(countryName){
    var returnLat = 0;
    var returnLon = 0;
    var zoomLevel = 13;
    switch(countryName){
        case "Austria":
            returnLat = 47.5162;
            returnLon = 14.5501;
            zoomLevel = 8;
            break;
        case "Belgium":
            returnLat = 50.5039;
            returnLon = 4.4699;
            zoomLevel = 8;
            break;
        case "Bulgaria":
            returnLat = 42.7339;
            returnLon = 25.4858;
            zoomLevel = 8;
            break;
        case "Croatia":
            returnLat = 45.1000;
            returnLon = 15.2000;
            zoomLevel = 8;
            break;
        case "Cyprus":
            returnLat = 35.1264;
            returnLon = 33.4299;
            zoomLevel = 13;
            break;
        case "Czechia":
            returnLat = 49.8175;
            returnLon = 15.4730;
            zoomLevel = 7;
            break;
        case "Denmark":
            returnLat = 56.2639;
            returnLon = 9.5018;
            zoomLevel = 7;
            break;
        case "Estonia":
            returnLat = 58.5953;
            returnLon = 25.0136;
            zoomLevel = 7;
            break;
        case "Finland":
            returnLat = 61.9241;
            returnLon = 25.7482;
            zoomLevel = 8;
            break;
        case "France":
            returnLat = 42.2276;
            returnLon = 2.2137;
            zoomLevel = 8;
            break;
        case "Germany":
            returnLat = 51.1657;
            returnLon = 10.4514;
            zoomLevel = 6;
            break;
        case "Greece":
            returnLat = 39.0742;
            returnLon = 21.8243;
            zoomLevel = 10;
            break;
        case "Hungary":
            returnLat = 47.1625;
            returnLon = 19.5033;
            zoomLevel = 7;
            break;
        case "Ireland":
            returnLat = 53.7798;
            returnLon = -7.3055;
            zoomLevel = 8;
            break;
        case "Italy":
            returnLat = 41.8719;
            returnLon = 12.5674;
            zoomLevel = 7;
            break;
        case "Latvia":
            returnLat = 56.8796;
            returnLon = 24.6032;
            zoomLevel = 7;
            break;
        case "Lithuania":
            returnLat = 55.1694;
            returnLon = 23.8813;
            zoomLevel = 7;
            break;
        case "Luxembourg":
            returnLat = 49.8153;
            returnLon = 6.1296;
            zoomLevel = 13;
            break;
        case "Malta":
            returnLat = 35.9375;
            returnLon = 14.3754;
            zoomLevel = 13;
            break;
        case "Netherlands":
            returnLat = 52.1326;
            returnLon = 5.2913;
            zoomLevel = 8;
            break;
        case "Poland":
            returnLat = 51.9194;
            returnLon = 19.1451;
            zoomLevel = 6;
            break;
        case "Portugal":
            returnLat = 39.3999;
            returnLon = -8.2245;
            zoomLevel = 8;
            break;
        case "Romania":
            returnLat = 45.9432;
            returnLon = 24.9668;
            zoomLevel = 8;
            break;
        case "Slovakia":
            returnLat = 48.6690;
            returnLon = 19.6990;
            zoomLevel = 8;
            break;
        case "Slovenia":
            returnLat = 46.1512;
            returnLon = 14.9955;
            zoomLevel = 8;
            break;
        case "Spain":
            returnLat = 40.4637;
            returnLon = -3.7492;
            zoomLevel = 6;
            break;
        case "Sweden":
            returnLat = 60.1282;
            returnLon = 18.6435;
            zoomLevel = 5;
            break;
    }
    return {country: countryName, lat: returnLat, lon: returnLon, zoom: zoomLevel}
}

  //export to make available elsewhere
  module.exports = leafletfxns;