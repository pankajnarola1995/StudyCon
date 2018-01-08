
let express = require('express');
let router = express.Router();



const mongoose = require('mongoose');
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
let Register = mongoose.model("Register", RegisterSchema);


//let contact = mongoose.model('contact');


/* GET home page. */

router.get('/', function (req, res, next) {

//let contact = mongoose.model('contact');

//database connection
    let dbConn = mongoose.connect('mongodb://localhost/StudyConDb', {
        useMongoClient: true,
        /* other options */
    });

    let Consultancy = mongoose.model("Consultancy");
    Consultancy.find(function (err, data) {

    });
});



router.get('/', function (req, res, next) {

    var Consultancy = mongoose.model("Consultancy");
    Consultancy.find(function (err, data) {

        if (data) {

            console.log("Get Counsultancy Details Data Fetched for menu :User ");
            //console.log(data);

            res.render('register', {Consultancy: data});
            //res.render('Admin/AdminContactView',{contact:data});
        }
        else {
            res.status(400).send(err);
        }

    });
});
router.post('/Add_User', function (req, res, next) {

    let AddUserData = new Register({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        date_of_birth: req.body.date_of_birth,
        address: req.body.address,
        gender: req.body.gender,
        nationality: req.body.nationality,
        highest_degree: req.body.highest_degree,
        intended_study_field: req.body.intended_study_field,
        degree_sought: req.body.degree_sought,
        password: req.body.password,


    });
    console.log(AddUserData);
    Register.find({email: req.body.email, password: req.body.password}, function (err, data) {
        if (err) {
            res.json({"err": err});
        } else {
            if (data.length == 1) {
                console.log(data);
                res.send("username is already there");

            } else {
                let promise = AddUserData.save();
                assert.ok(promise instanceof require('mpromise'));
                promise.then(function (result) {
                    console.log("inserted user data"); // "Stuff worked!"
                }, function (err) {
                    console.log(err); // Error: "It broke"
                });
                console.log(data);
                req.session.email = req.body.email;
                console.log(req.session.EmailId);

                res.redirect('/');

            }
            //res.send(data);
        }
    });
});

module.exports = router;
