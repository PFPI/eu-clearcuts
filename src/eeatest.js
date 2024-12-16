const eeafxns = require("./eeafxns");

const main = async() => {
let mydata = await eeafxns.getFromHabitatTable("SI3000337");
console.log(mydata.data.features);
}
main();