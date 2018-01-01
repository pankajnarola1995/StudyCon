let express = require('express');
let router = express.Router();
const mongoose= require('mongoose');


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
