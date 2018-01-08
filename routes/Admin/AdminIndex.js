let express = require('express');
let router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
   console.log(req.session.EmailId );
    if(req.session.EmailId) //&& (req.session.Password)
    {
    //console.log("admin");
    res.render('Admin/AdminIndex');
    }
    else {
        res.redirect('/Admin')
    }

});


module.exports = router;
