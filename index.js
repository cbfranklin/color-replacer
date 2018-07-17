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