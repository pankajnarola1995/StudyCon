var express = require('express');
var router = express.Router();



/* GET home page. */

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

module.exports = router;
