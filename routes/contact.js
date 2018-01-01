let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let assert = require('assert');



router.get('/', function(req, res, next) {
    res.render('contact');
});
let contactSchema = mongoose.Schema({

    Name: String,
    Subject: String,
    Email: String,
    Message: String

});
//Consultancy Table Create
//Image Table Create
let contact = mongoose.model("contact", contactSchema);

//contact method call
router.post('/saveContact',  (req, res) => {
    console.log("postcontact");
    let contactdata = new contact({
        Name: req.body.name,
        Subject: req.body.subject,
        Email: req.body.email,
        Message: req.body.message
    });
    contactdata.save(function (error, data) {
        if (error) {
            console.log("contact insert error ");
            res.json(error);

        }
        else {
            console.log("contact inserted ");
            res.redirect("/");
        }
    });
});
/*router.get('/get-data',function (req,res,next) {
    let resultArray = [];
    mongo.connect(url,function (err,db) {
        assert.equal(null,err);
       let cursor = db.collection('contact').find();
       cursor.forEach(function(doc,err){
           assert.equal(null,err);
           resultArray.push(doc);
       }, function () {
            db.close();
            res.render('contact',{items:resultArray});
       } );
    });
});




*/
module.exports = router;