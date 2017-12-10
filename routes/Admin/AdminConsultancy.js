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


//Consultancy Insert data
  /*  router.post('/AdminConsultancyAddData', function (req, res) {
        console.log("AdminConsultancyAddData");

        if (!req.files)
            return res.status(400).send('No files were uploaded.');

        var flage_image1 = req.files.flage_image;
        console.log(flage_image1);
        // Use the mv() method to place the file somewhere on your server
        var newpath = './public\\images\\' + flage_image1.name;
        flage_image1.mv(newpath, function (err) {
            if (err)
                return res.status(500).send(err);

            console.log('File uploaded Flage Image Consultancy!');
        });


        var consultancyData = new Consultancy({
            country_name: req.body.country_name,
            flage_image: flage_image1.name,
            requirenment: req.body.requirenment,
            detail: req.body.detail,
            important_link: req.body.important_link,
            images: images.name
        });
        console.log(consultancyData);

        var promise = consultancyData.save();
        assert.ok(promise instanceof require('mpromise'));

        if (promise) {
            console.log("inserted country data");
            res.redirect("/AdminConsultancy");
        }
        else {
            console.log("error in insert country");
            res.redirect("/AdminConsultancy");

        }
    });
*/


});

module.exports = router;
