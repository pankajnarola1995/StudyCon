var express = require('express');
var router = express.Router();
const mongoose= require('mongoose');


//var contact = mongoose.model('contact');

/* GET home page. */
router.get('/', function(req, res, next) {

//var contact = mongoose.model('contact');

//database connection
    var dbConn = mongoose.connect('mongodb://localhost/StudyConDb', {
        useMongoClient: true,
        /* other options */
    });

    var Consultancy = mongoose.model("Consultancy");
    Consultancy.find(function (err,data) {
        if (data) {

            console.log("Get Counsultancy Details Data Fetched for menu :User ");
            //console.log(data);

            res.render('register',{Consultancy:data});
            //res.render('Admin/AdminContactView',{contact:data});
        }
        else {
            res.status(400).send(err);
        }

    });
});
module.exports = router;
