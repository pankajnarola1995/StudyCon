var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    //console.log("admin");
    res.render('Admin/AdminIndex');
});
router.get('/Admin/AdminConsultancy', function(req, res, next) {
    //console.log("admin");
    res.render('Admin/AdminConsultancy');
});

module.exports = router;