let express = require('express'),
    router = express.Router(),
    Consultancy = require('../model/Admin/AdminConsultancy'),
    Register = require('../model//Register');

//let contact = mongoose.model('contact');
/* GET home page. */
router.get('/', function(req, res, next) {

    Consultancy.find(function (err,data) {
        if (data) {

            console.log("Get Counsultancy Details Data Fetched for menu :User ");
            //console.log(data);

            res.render('login',{Consultancy:data});
            //res.render('Admin/AdminContactView',{contact:data});
        }
        else {
            res.status(400).send(err);
        }

    });
});
router.post('/UserLogin', function(req, res, next) {

    Register.find({email:req.body.email,password:req.body.password},function (err,data) {
        if (err) {
            res.json({"err": err});
        } else {
            if (data.length === 1) {
                console.log(data);
                req.session.email = req.body.email;
                console.log(req.session.email);

                res.redirect('/');
            } else {
                console.log(data);
                console.log("username or password do not match");
               // window.alert("username or password do not match");
               // JSAlert.alert("username or password do not match");
                res.send('username or password do not match');
            }
        }
    });
});
router.get('/logout', function(req, res, next) {

    req.session.destroy();

                res.redirect('/');

});

module.exports = router;
