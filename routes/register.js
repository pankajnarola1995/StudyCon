let express = require('express');
let router = express.Router();
const mongoose= require('mongoose');
let assert = require('assert');
let Schema = mongoose.Schema;
let path = require('path');

let RegisterSchema = mongoose.Schema({
    name: String,
    surname: String,
    email: String,
    date_of_birth: String,
    address: String,
    gender: String,
    nationality: String,
    highest_degree: String,
    intended_study_field: String,
    degree_sought: String,
    password: String,
    confirm_password: String,
});




//let contact = mongoose.model('contact');

/* GET home page. */
router.get('/', function(req, res, next) {

//let contact = mongoose.model('contact');

//database connection
    let dbConn = mongoose.connect('mongodb://localhost/StudyConDb', {
        useMongoClient: true,
        /* other options */
    });

    let Consultancy = mongoose.model("Consultancy");
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
