const fs = require("fs");
let mycaches = {};

mycaches.writeCache = function (finalData) {
  fs.writeFile('mydbdata.json', JSON.stringify(finalData), (error) => {
    if (error) throw error;
  });
};

mycaches.readCache = function(){
  const myfile = fs.readFileSync("./mydbdata.json", 'utf8');
  return JSON.parse(myfile);
 }

module.exports = mycaches;
