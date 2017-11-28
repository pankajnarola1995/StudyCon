var express = require('express');
var router = express.Router();
const mongoose= require('mongoose');
var assert = require('assert');

/* GET users listing. */
router.get('/', function(req, res, next) {
    //console.log("admin");

//database connection
    var dbConn = mongoose.connect('mongodb://localhost/StudyConDb', {
        useMongoClient: true,
        /* other options */
    });

    var Consultancy = mongoose.model("Consultancy");

    Consultancy.find(function (err,Consultancydata) {
        if(Consultancydata){
            console.log("Consultancy Data Fetched: Admin");

            res.render('Admin/AdminConsultancy',{Consultancy:Consultancydata});
        }
        else
        {
            res.status(400).send(err);
        }

    });




});

module.exports = router;
