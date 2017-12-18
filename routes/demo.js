var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send('/');
});

router.get('/methodone', function(req, res, next) {
    //console.log("admin");
    // res.render('Admin/AdminIndex');
    res.send('one');
});

router.get('/methodtwo', function(req, res, next) {
    //console.log("admin");
    // res.render('Admin/AdminIndex');
    res.send('two');
});

module.exports = router