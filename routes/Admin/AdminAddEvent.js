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

    var AddEvent = mongoose.model("AddEvent");

    AddEvent.find(function (err,AddEventdata) {
        if(AddEventdata){
            console.log("AddEvent Data Fetched: Admin");

            res.render('Admin/AdminAddEvent',{AddEvent:AddEventdata});
        }
        else
        {
            res.status(400).send(err);
        }

    });




});

module.exports = router;
