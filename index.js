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

  // extract all hex colors
  sourceColors = data.match(/#(?:[0-9a-f]{3}){1,2}/g);
  
  // provide to nearest-color
  nearestColor = require("nearest-color").from(sourceColors);

  // next: get stylesheet to replace
  fs.readFile(stylesheetToReplace, "utf8", extractColorsToReplace);

}

const extractColorsToReplace = (err, data) => {
 
  if (err) throw err;

  // save stylesheet for later
  stylesheetToReplace = data;

  // extract all hex colors
  colorsToReplace = data.match(/#(?:[0-9a-f]{3}){1,2}/g);
  
  // prepare to replace
  replaceColors();

}

const replaceColors = () => {
  
  // for each color 
  for (color of colorsToReplace) {
    
    // get nearest color from source
    const newColor = nearestColor(color);
    
    // push a find/replace object
    replaceMatrix.push({
      old: color,
      new: newColor
    });
  }
  
  // for each find/replace object
  for (r of replaceMatrix) {
    
    // create regex for old color
    const re = new RegExp(r.old, "g");

    // find all instances of old color and replace with new
    stylesheetToReplace = stylesheetToReplace.replace(re, r.new);
  }

  // save new stylesheet
  fs.writeFile(outputPath, stylesheetToReplace, (err) => {
    if (err) throw err;
    console.log(`Saved new stylesheet ${outputPath}`);
  });

}

// start here: get source stylesheet
fs.readFile(colorSource, "utf8", extractSourceColors);