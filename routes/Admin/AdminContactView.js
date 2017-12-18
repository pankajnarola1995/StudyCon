var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    //console.log("admin");
    res.render('Admin/AdminContactView');
});


module.exports = router;
