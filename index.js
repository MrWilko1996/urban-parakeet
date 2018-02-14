var request = require('request'),
    cheerio = require('cheerio'),
    Knwl = require('knwl.js');

var ignoredTLDs = [
    'hotmail',
    'live',
    'gmail',
    'yahoo',
    'icloud'
];

var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

// Obtain email address from CMD
var args = process.argv.slice(2);
var emailAddress = args[0];

ignoredTLDs.forEach(function($domain) {
    if((emailAddress.toLowerCase()).indexOf("@" + ($domain.toLowerCase())) >= 0) {
        throw new Error("Email TLD matches one of our blacklisted values");
    }
});

if(!emailRegex.test(emailAddress)) {
    throw new Error("Email failed regex check, please verify the given email address");
}

var companyURL = "https://www." + emailAddress.substring(emailAddress.lastIndexOf("@") +1);

request(companyURL, function (error, response, html) {

    if(error) {
    throw new error("Failed to load webpage based from URL '" + companyURL +"'");
    }

    var knwlInst = new Knwl('english');
    var $  = cheerio.load(html);

    var companyAddress;
    var companyPhoneNumbers = [];
    var additionalCompanyEmails = [];
    
});

