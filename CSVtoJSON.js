//Read file
//Break down the file
//Extract header row
//Filter and aggregate the data
//Convert the data to JSON
//Write the JSON to a file

//Visualisation (using d3.js)

const fs = require('fs');
const readline = require('readline');

const csvData = fs.createReadStream("./data/input/chicagocrimes.csv");

const rl = readline.createInterface({input: csvData});
let isHeader = true;
let header = [];
let year, primaryType, description;

let finalData = {};

console.time("CSV");
rl.on('line', (line) => {
    if(isHeader) {
        isHeader = false;
        header = line.split(',');
        year = header.indexOf('Year');
        primaryType = header.indexOf('Primary Type');
        description = header.indexOf('Description');
    }
    else {
        const row = line.split(",");
        if( row[primaryType] == "THEFT" && row[year] && row[year] >= 2001 && row[year] <= 2018 ) {
            let row_year = row[year];
            if(row[description] === "OVER $500" || row[description] === "$500 AND UNDER") {
                //If year key is not present add a empty year key/value pair
                if(!finalData[row_year]) {
                    finalData[row_year] = {"theftOver500":0,"theftUnder500":0};
                }
            }
            if(row[description] === "OVER $500") {
                finalData[row_year]['theftOver500']++;
            }
            else if(row[description] === "$500 AND UNDER") {
                finalData[row_year]['theftUnder500']++;
            }
        }
    }
});

rl.on("close", () => {
    let data = [];
    for(key in finalData) {
        var value = finalData[key];
        console.log(value);
        data.push(Object.assign({"year":key},value));
    }
    fs.writeFile('./data/output/theft.json', JSON.stringify(data), (err) => {
        console.timeEnd("CSV");
        if(err) {
            console.log("ERROR : %s", err);
        }
        else {
            console.log("FILE WRITTEN");
        }
    })
})