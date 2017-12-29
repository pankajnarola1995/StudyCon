var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    if (req.session.EmailId) {
        //console.log("admin");
        res.render('Admin/AdminLanguage');
    }else {
        res.redirect('/Admin');
    }
});

module.exports = router;
