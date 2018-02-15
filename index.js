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

var companyAddress;
var companyPhoneNumbers = [];
var additionalCompanyEmails = [];

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

    $("span, p, a").each(function (e, element) {
        var targetString = $(this).text();
        if (targetString === '') {
            return;
        }
        knwlInst.init(targetString);

        // Email Addresses
        var emailAddresses = (knwlInst.get('emails'));

        for (index = 0; index < emailAddresses.length; index++) {
            if (emailAddresses[index]['address'].length >= 1 && additionalCompanyEmails[emailAddresses[index]['address']] !== emailAddresses[0]['address']) {
                additionalCompanyEmails[emailAddresses[index]['address']] = emailAddresses[0]['address'];
            }
        }
        
        // Phone Numbers
        var phoneNumbers = (knwlInst.get('phones'));
        if (phoneNumbers === undefined || phoneNumbers.length === 0) {
            targetString = targetString.replace(/\s+/g, '');
            if (targetString.charAt(0) === "+") {
                targetString = targetString.slice(1);
            }
            knwlInst.init(targetString);
            phoneNumbers = (knwlInst.get('phones'));
        }


        for (index = 0; index < phoneNumbers.length; index++) {
            if (phoneNumbers[index]['phone'].length >= 1 && companyPhoneNumbers[phoneNumbers[index]['phone']] !== phoneNumbers[0]['phone']) {
                companyPhoneNumbers[phoneNumbers[index]['phone']] = phoneNumbers[0]['phone'];
            }
        }
    });

    console.log(additionalCompanyEmails);
    console.log(companyPhoneNumbers);

});