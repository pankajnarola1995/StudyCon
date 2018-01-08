let express = require('express'),
    router = express.Router(),
    Contact = require('../../model/contact');
router.get('/', function (req, res, next) {
    //console.log("admin");

    if (req.session.EmailId) //&& (req.session.Password)
    {

        Contact.find(function (err, Contactdata) {
            if (Contactdata) {
                console.log("Contact Data Fetched: Admin");

                res.render('Admin/AdminContactView', {Contact: Contactdata});
            }
            else {
                res.status(400).send(err);
            }

        });
    }
    else {
        res.redirect('/Admin');
    }
});

//Contact Delete data
router.post('/AdminContactDelete', (req, res) => {
    if (req.session.EmailId) {
        let cid = req.body.cid;
        console.log(cid);
        Contact.remove({_id: cid}, function (err) {
            if (err) {
                res.json({"err": err});
            } else {
                res.json({success: true});

            }

        });
    }
    else {
        res.redirect('/Admin');
    }

});


module.exports = router;
