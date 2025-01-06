const csvFilePath='./src/utils/export_n2kloggedareas_20241030.csv'
//app.js/

const fs = require("fs");
csv = fs.readFileSync(csvFilePath);

const array = csv.toString().split("\r");
let result = [];

let headers = array[0].split(",")

for (let i = 1; i < array.length - 1; i++) {
    let obj = {}

    let str = array[i]
    let s = ''

    let flag = 0
    for (let ch of str) {
        if (ch === '"' && flag === 0) {
            flag = 1
        }
        else if (ch === '"' && flag == 1) flag = 0
        if (ch === ',' && flag === 0) ch = '|'
        if (ch !== '"') s += ch
    }

    let properties = s.split("|")

    for (let j in headers) {
        if (properties[j].includes(",")) {
            obj[headers[j]] = properties[j]
                .split(",").map(item => item.trim())
        }
        else obj[headers[j]] = properties[j]
    }
    result.push(obj)
}

let json = JSON.stringify(result);
fs.writeFileSync('./src/data/output.json', json);