let express = require('express'),
    router = express.Router(),
    Consultancy = require('../model/Admin/AdminConsultancy'),
    Language = require('../model/Admin/AdminLanguage'),
    PilotTraining = require('../model/Admin/AdminPilotTraining'),
    CallCenter = require('../model/Admin/AdminCallCenter'),
    HomeBanner = require('../model/Admin/AdminHomeBanner'),
    AdminEvent = require('../model/Admin/AdminAddEvent'),
    contact = require('../model/contact');

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
    Consultancy.find(function (err, Consultancydata) {
        Language.find(function (err, Languagedata) {
            PilotTraining.find(function (err, PilotTrainingdata) {
                CallCenter.find(function (err, CallCenterdata) {
                    HomeBanner.find(function (err, HomeBannerdata) {
                        AdminEvent.find(function (err, AdminEventdata) {

                            if (Consultancydata && Languagedata && PilotTrainingdata && CallCenterdata && HomeBannerdata && AdminEventdata) {

                                console.log("Get Counsultancy Details Data Fetched for menu :User ");

                                res.render('index', {
                                    Consultancy: Consultancydata,
                                    Language: Languagedata,
                                    PilotTraining: PilotTrainingdata,
                                    CallCenter: CallCenterdata,
                                    HomeBanner: HomeBannerdata,
                                    AdminEvent: AdminEventdata,
                                });
                            }
                            else {
                                res.render('index');

                            }

                                if (Consultancydata && Languagedata && PilotTrainingdata && CallCenterdata && HomeBannerdata && AdminEventdata) {

                                    console.log("Get Counsultancy Details Data Fetched for menu :User ");
                                    res.render('index', {
                                        Consultancy: Consultancydata,
                                        Language: Languagedata,
                                        PilotTraining: PilotTrainingdata,
                                        CallCenter: CallCenterdata,
                                        HomeBanner: HomeBannerdata,
                                        AdminEvent: AdminEventdata,
                                    });
                                }
                                else {
                                    res.render('index');
                                }
                        });
                    });
                });
            });
        });
    });
});
router.post('/search', function (req, res, next) {

    let keyword = req.body.keyword;
    console.log(keyword);
//alert('he');
    /* let Consultancy = mongoose.model("Consultancy");
     Consultancy.find(function (err, data) {
         if (data) {

             console.log("Get Counsultancy Details Data Fetched for menu :User ");
             res.send('index', {Consultancy: data});
         }
         else {
             res.render('index');
         }

     });

    search.web('Tutta Bella Neapolitan Pizzeria',
        {top: 5},
        function (err, results) {
            console.log(util.inspect(results,
                {colors: true, depth: null}));
            console.log(err);
            res.send(err);

            res.send(results);

        }
    );



    Consultancy.find( keyword, (err, data) => {
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
            for (let header in response.headers)
                // header keys are lower-cased by Node.js
                if (header.startsWith("bingapis-") || header.startsWith("x-msedge-"))
                    console.log(header + ": " + response.headers[header]);
            // body = JSON.stringify(JSON.parse(body), null, '  ');
            let parsedBody = JSON.parse(body);
            body = JSON.stringify(parsedBody, null, '  ');


            let name = parsedBody.webPages.value.map(function (item) {
                return item.name;
            })

            console.log('\nJSON Response:\n');
            console.log(name);
            res.send(name);

        });
        response.on('error', function (e) {
            console.log('Error: ' + e.message);
        });
    };

    let bing_web_search = function (search) {
        console.log('Searching the Web for: ' + term);
        let request_params = {
            method: 'GET',
            hostname: host,
            path: path + '?q=' + encodeURIComponent(search),
            top: 10,
            headers: {
                'Ocp-Apim-Subscription-Key': subscriptionKey,
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

router.post('/saveContact', (req, res) => {
    console.log("postcontact");
    /*let contactdata = new contact({
        Name: req.body.name,
        Subject: req.body.subject,
        Email: req.body.email,
        Message: req.body.message
    });
   */
    let contactdata = new contact(req.body.contactdata);
    contactdata.save(function (error, data) {
        if (error) {
            console.log("contact insert error ");
            res.json(error);

        }
        else {
            console.log("Contacted Successfully ! Will Get You Back Soon... ");
            res.send("true");
        }
    });
});
module.exports = router;
