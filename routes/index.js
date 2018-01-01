let express = require('express');
let router = express.Router();
const mongoose = require('mongoose');
let Search = require('bing.search');
let util = require('util');
let Schema = mongoose.Schema;
let searchable = require('mongoose-searchable');

//let Consultancy = require('model/Admin/consultancy');


//search = new Search('a5098d7790c74c68beafede1a729dc9a');
//let Consultancy = mongoose.model("Consultancy");

'use strict';

let https = require('https');

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace the subscriptionKey string value with your valid subscription key.
let subscriptionKey = 'a5098d7790c74c68beafede1a729dc9a';

// Verify the endpoint URI.  At this writing, only one endpoint is used for Bing
// search APIs.  In the future, regional endpoints may be available.  If you
// encounter unexpected authorization errors, double-check this host against
// the endpoint for your Bing Web search instance in your Azure dashboard.
let host = 'api.cognitive.microsoft.com';
let path = '/bing/v7.0/search';


/* GET home page. */
router.get('/', function (req, res, next) {
    Consultancy.find(function (err, data) {
        if (data) {

            console.log("Get Counsultancy Details Data Fetched for menu :User ");
            res.render('index', {Consultancy: data});
        }
        else {
            res.render('index');
        }

    });
});

router.post('/search', function (req, res, next) {

    var keyword = req.body.keyword;
    console.log(keyword);
//alert('he');
    /* var Consultancy = mongoose.model("Consultancy");
     Consultancy.find(function (err, data) {
         if (data) {

             console.log("Get Counsultancy Details Data Fetched for menu :User ");
             res.send('index', {Consultancy: data});
         }
         else {
             res.render('index');
         }

     });/*

    search.web('Tutta Bella Neapolitan Pizzeria',
        {top: 5},
        function (err, results) {
            console.log(util.inspect(results,
                {colors: true, depth: null}));
            console.log(err);
            res.send(err);

            res.send(results);

        }
    );*/


    
  /*  Consultancy.find( keyword, (err, data) => {
        if(err) console.log(err);
        console.log(data);
        res.send(data)
    });

*/
    //res.send(data);
    let term = keyword;

    let response_handler = function (response) {
        let body = '';
        response.on('data', function (d) {
            body += d;
        });
        response.on('end', function () {
            console.log('\nRelevant Headers:\n');
            for (var header in response.headers)
                // header keys are lower-cased by Node.js
                if (header.startsWith("bingapis-") || header.startsWith("x-msedge-"))
                    console.log(header + ": " + response.headers[header]);
            body = JSON.stringify(JSON.parse(body), null, '  ');
            console.log('\nJSON Response:\n');
            console.log(body);
            res.send(body);

        });
        response.on('error', function (e) {
            console.log('Error: ' + e.message);
        });
    };

    let bing_web_search =    function (search) {
        console.log('Searching the Web for: ' + term);
        let request_params = {
            method : 'GET',
            hostname : host,
            path : path + '?q=' + encodeURIComponent(search),
            headers : {
                'Ocp-Apim-Subscription-Key' : subscriptionKey,
            }
        };

        let req = https.request(request_params, response_handler);
        req.end();
    }

    if (subscriptionKey.length === 32) {
        bing_web_search(term);
    } else {
        console.log('Invalid Bing Search API subscription key!');
        console.log('Please paste yours into the source code.');
    }

    //res.send(keyword);

});

module.exports = router;
