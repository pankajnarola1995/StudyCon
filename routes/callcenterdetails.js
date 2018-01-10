let express = require('express'),
    router = express.Router(),
    Consultancy = require('../model/Admin/AdminConsultancy'),
    Language = require('../model/Admin/AdminLanguage'),
    PilotTraining = require('../model/Admin/AdminPilotTraining'),
    CallCenter = require('../model/Admin/AdminCallCenter'),
    HomeBanner = require('../model/Admin/AdminHomeBanner'),
    AdminEvent = require('../model/Admin/AdminAddEvent'),
    Image = require('../model/Admin/AdminImages'),
    contact = require('../model/contact');

const mongoose = require('mongoose');

//let searchable = require('mongoose-searchable');

//let Consultancy = require('model/Admin/consultancy');
//router.use('/Admin/AdminConsultancy', require('./Admin/AdminConsultancy'))


/* GET Consultancy listing. */
router.get('/', function (req, res, next) {

    CallCenter.find(function (err, CallCenterdata) {
        if (CallCenterdata) {
            console.log("Call Center Data Fetched: Admin");

            res.render('callcenterdetails', {CallCenter: CallCenterdata});
        }
        else {
            res.status(400).send(err);
        }
    });


});

router.post('/FetchData', function (req, res, next) {
    if (req.session.email) {

        let id = req.body.id;
        console.log(id);
        CallCenter.find({'_id': id}, function (err, MoreCallCenterdata) {
            Image.find({'CallCenter_id': id}, function (err, CallCenterdataImages) {

                Consultancy.find(function (err, Consultancydata) {
                    Language.find(function (err, Languagedata) {
                        PilotTraining.find(function (err, PilotTrainingdata) {
                            CallCenter.find(function (err, CallCenterdata) {
                                HomeBanner.find(function (err, HomeBannerdata) {
                                    AdminEvent.find(function (err, AdminEventdata) {

                                        if (Consultancydata && Languagedata && PilotTrainingdata && CallCenterdata && HomeBannerdata && AdminEventdata) {

                                            console.log("Get  Details Data Fetched for menu :User ");
                                            console.log(CallCenterdataImages);

                                            res.render('callcenterdetails', {
                                                Consultancy: Consultancydata,
                                                MoreCallCenterdata: MoreCallCenterdata,
                                                CallCenterdataImages: CallCenterdataImages,
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
        });
    }else {
        res.redirect("/");
    }
});


module.exports = router;
