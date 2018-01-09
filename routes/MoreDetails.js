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

//let searchable = require('mongoose-searchable');

//let Consultancy = require('model/Admin/consultancy');
//router.use('/Admin/AdminConsultancy', require('./Admin/AdminConsultancy'))


/* GET Consultancy listing. */
router.get('/', function (req, res, next) {

        Consultancy.find(function (err, Consultancydata) {
            if (Consultancydata) {
                console.log("Consultancy Data Fetched: Admin");

                res.render('MoreDetails', {Consultancy: Consultancydata});
            }
            else {
                res.status(400).send(err);
            }
        });

   
});


module.exports = router;
