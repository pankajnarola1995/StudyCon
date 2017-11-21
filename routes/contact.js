var express = require('express');
var router = express.Router();
var mongo = require('mongoose');
var assert = require('assert');
var app = express();

var url = 'mongodb://localhost:27017/StudyConDb';


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('contact');
});

/*router.get('/get-data',function (req,res,next) {
    var resultArray = [];
    mongo.connect(url,function (err,db) {
        assert.equal(null,err);
       var cursor = db.collection('contact').find();
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