var http = require("http");
var https = require("https");

/**
 * getJSON:  REST get request returning JSON object(s)
 * @param options: http options object
 * @param callback: callback to pass the results JSON object(s) back
 */



//Load the request module
var request = require('request');

//Lets configure and request
module.exports.downloadMenu = function(req, res, next) {
    var options = {
        url: 'https://api.locu.com/v2/venue/search',
        method: 'POST',
        headers: { //We can define headers too
            'Content-Type': 'application/JSON',

        },
        //NEED TO INSERT LOCUAPI KEY
        body: JSON.stringify({
          "api_key" : "",
          "fields" : [ "name", "location", "menus", "menu_url", "website_url" ],
          "venue_queries" : [
            {
              "name" : req.body.name,
              "location": { "postal_code" : req.body.postal_code },
              "menus" : {"$present": true}
            }
          ]
        })
    };
    request(options, function(error, response, body){
        if(error) {
            console.log(error);
        } else {
            console.log(response.statusCode, body);
            res.menu = body;
            next();
        }
    });

}