const fileio = require("../controllers/fileio");
const cutRecords = require("../controllers/cutRecords");

//let myCutRecordsCache = fileio.readCutRecordsCache();

//console.log(myCutRecordsCache.filter((record) => record.sitecode == "SI3000172"))

console.log(cutRecords.getCutYearHA("SI3000137", 2003));
console.log(cutRecords.getTotalHA("SI3000137"));