//Scrape

//Require packages for scraping
var request = require("request");
var cheerio = require("cheerio");

var scrape = function(cb){
    request("https://www.washingtonpost.com", function(err, res, body){
        var $ = cheerio.load(body);
        var articles = [];
        $(".moat-trackable").each(function(i, element){
            
            var head = $(this).children("a").text().trim();
            var sum = $(this).children(".blurb").text().trim();
            
            if(head && sum){
                var headRaw = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
                var sumRaw = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

                var dataToAdd = {
                    headline: headRaw,
                    summary: sumRaw
                }

                articles.push(dataToAdd);
            }
        
        });
        cb(articles);
    });
}

module.exports = scrape;