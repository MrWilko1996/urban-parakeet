var request = require('request'),
    cheerio = require('cheerio'),
    knwl = require('knwl.js');

var args = process.argv.slice(2);

// Print out the given parameter from the CMD
console.log(args);
