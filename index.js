// const dlColors = [
//   "#f6f6f6",
//   "#eeeeee",
//   "#dbdbdb",
//   "#767676",
//   "#444444",
//   "#242424",
//   "#6633cc",
//   "#99cc00",
//   "#19233c",
//   "#1774bb",
//   "#cc0000",
//   "#107a1b",
//   "#ffffff",
//   "#49b0ff",
//   "#ff5522",
//   "#99cc00",
//   "#dbdbdb",
//   "#004498",
//   "#0065e3",
//   "#3991ff",
//   "#98c6ff",
//   "#4ccecf",
//   "#65eced",
//   "#87feff",
//   "#cffeff",
//   "#cdbb15",
//   "#f2dc17",
//   "#fdee67",
//   "#fcf4af",
//   "#d28720",
//   "#ffa120",
//   "#fcba5f",
//   "#fed49a",
//   "#cf71d1",
//   "#f97cfa",
//   "#f9a1fb",
//   "#f9d3f9",
//   "#c74272",
//   "#ff5593",
//   "#fa86b0",
//   "#f5bdd1",
//   "#892eb1",
//   "#b137e8",
//   "#c37ae4",
//   "#ebbeff",
//   "#663b2d",
//   "#94533d",
//   "#d46a46",
//   "#ee9b7f",
//   "#868686",
//   "#aaaaaa",
//   "#c9c9c9",
//   "#dddcdc",
//   "#828b9b",
//   "#8a99b8",
//   "#b7c9ed",
//   "#e3e8f2",
//   "#cd8484",
//   "#ff9c9c",
//   "#fec8c8",
//   "#fde1e1",
//   "#63ad02",
//   "#e33501",
//   "#c6c6c6",
//   "#ffffff"
// ];

// const solarizedColors = [
//   "#002b36",
//   "#073642",
//   "#586e75",
//   "#657b83",
//   "#839496",
//   "#93a1a1",
//   "#eee8d5",
//   "#fdf6e3",
//   "#b58900",
//   "#cb4b16",
//   "#dc322f",
//   "#d33682",
//   "#6c71c4",
//   "#268bd2",
//   "#2aa198",
//   "#859900",
//   "#073642",
//   "#021014",
//   "#819090",
//   "#77ee77"
// ];

const args = process.argv;
var colorSource = args[2];
var stylesheetToReplace = args[3];
var outputPath = args[4];

console.log({colorSource, stylesheetToReplace, outputPath});

var sourceColors,
    colorsToReplace,
    nearestColor,
    replaceMatrix = [];

const fs = require("fs");

const extractSourceColors = (err, data) => {
  if (err) throw err;
  sourceColors = data.match(/#(?:[0-9a-f]{3}){1,2}/g);
  nearestColor = require("nearest-color").from(sourceColors);
  fs.readFile(stylesheetToReplace, "utf8", extractColorsToReplace);
}

const extractColorsToReplace = (err, data) => {
  if (err) throw err;
  stylesheetToReplace = data;
  colorsToReplace = data.match(/#(?:[0-9a-f]{3}){1,2}/g);
  replaceColors();
}

const replaceColors = () => {
  for (color of colorsToReplace) {
    console.log(color);
    const newColor = nearestColor(color);
    replaceMatrix.push({
      old: color,
      new: newColor
    });
  }
  for (r of replaceMatrix) {
    const re = new RegExp(r.old, "g");
    stylesheetToReplace = stylesheetToReplace.replace(re, r.new);
  }
  fs.writeFile(outputPath, stylesheetToReplace, (err) => {
    if (err) throw err;
    console.log(`Saved new stylesheet ${outputPath}`);
  });
}

fs.readFile(colorSource, "utf8", extractSourceColors);

// let replaceColors = [];



// const fs = require("fs");

// for (sc of solarizedColors) {
//   console.log(sc);
//   const newColor = nearestColor(sc);
//   replaceColors.push({
//     old: sc,
//     new: newColor
//   });
// }

// console.log("Colors to be replaced:", replaceColors);

// fs.readFile("solarized.css", "utf8", function(err, data) {
//   if (err) throw err;
// //   console.log(data);
//   for (r of replaceColors) {
//     const re = new RegExp(r.old, "g");
//     // console.log(re,r.new)
//     data = data.replace(re, r.new);
//   }
//   fs.writeFile('new.css', data, (err) => {
//     if (err) throw err;
//     console.log('The file has been saved!');
//   });
// });
