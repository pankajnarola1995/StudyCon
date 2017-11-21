var express = require('express');
var router = express.Router();
const mongoose= require('mongoose');
var dbConn = mongoose.connect('mongodb://localhost/StudyConDb', {
    useMongoClient: true,
    /* other options */
});


//var contact = mongoose.model('contact');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
//var contact = mongoose.model('contact');
router.get('/ajaxcallClear', function (req,res) {
    var data1={
        contactId: '1',
        firstName:'2',
        lastName:'3',
        email:'4',


    };
    res.send(data1);

});
module.exports = router;
