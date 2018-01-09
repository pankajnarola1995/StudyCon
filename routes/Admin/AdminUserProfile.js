let express = require('express'),
    router = express.Router(),
    Register = require('../../model/Register');

router.get('/', function (req, res, next) {
    //console.log("admin");

    if (req.session.EmailId) //&& (req.session.Password)
    {

        Register.find(function (err, Registerdata) {
            if (Registerdata) {
                console.log("Register Data Fetched: Admin");

                res.render('Admin/AdminUserProfile', {Register: Registerdata});
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


//Register Delete data
router.post('/AdminRegisterDelete', (req, res) => {
    if (req.session.EmailId) {
        let cid = req.body.cid;
        console.log(cid);
        Register.remove({_id: cid}, function (err) {
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


//Register Delete All data
router.post('/AdminRegisterDeleteAll', (req, res) => {
    if (req.session.EmailId) {
        Register.remove( function (err) {
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
