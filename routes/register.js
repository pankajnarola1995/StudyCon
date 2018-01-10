
let express = require('express'),
    router = express.Router(),
    Consultancy = require('../model/Admin/AdminConsultancy'),
    Register = require('../model/Register');

const mongoose = require('mongoose');
let assert = require('assert');
let Schema = mongoose.Schema;
let path = require('path');


router.get('/', function (req, res, next) {

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

    Register.find({email: req.body.email}, function (err, data) {
        if (data.length >= 1) {
            res.send("Username Already Exists! ");
        } else {
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

            let promise = AddUserData.save();
            assert.ok(promise instanceof require('mpromise'));
            promise.then(function (result) {
                console.log("inserted user data"); // "Stuff worked!"
                res.redirect('/signin');
            }, function (err) {
                console.log(err); // Error: "It broke"
                res.redirect('/register');
            });
        }
    });



});

module.exports = router;
