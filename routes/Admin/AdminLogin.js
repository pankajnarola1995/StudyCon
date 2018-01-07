let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let assert = require('assert');
let Schema = mongoose.Schema;

let AdminLoginSchema = mongoose.Schema({
    EmailId: String,//{ type: Schema.Types.ObjectId, ref: 'Consultancy' },
    Password: String,

});
let AdminLogin = mongoose.model("AdminLogin", AdminLoginSchema);


/* GET users listing. */
router.get('/', (req, res, next) => {
    if (req.session.EmailId)
    {
        res.redirect('AdminIndex');
    }else {
        //console.log("admin");
        res.render('Admin/AdminLogin');
    }
});

router.post('/LoginCheck', function (req, res, next) {
    console.log("LoginCheck"+ req.body.EmailID);

    AdminLogin.find({EmailId: req.body.EmailID,Password:req.body.Password}, function (err, data) {
        if (err) {
            res.json({"err": err});
        } else {
            if (data.length === 1) {
                console.log(data);
               req.session.EmailId = req.body.EmailID;
               req.session.Password = req.body.Password;
                console.log(req.session.EmailId);
                console.log(req.session.Password);

                res.redirect('/AdminIndex');
            } else {
                console.log(data);
                res.send("username or password do not match");
            }
            //res.send(data);
        }
    });
    //res.redirect('/AdminIndex');

    /*if (err) {
            res.send({"err": err});
        } else {
            if (data.length == 1) {
                console.log(data);
                res.redirect('/AdminIndex');
            } else {
                res.send(data);
            }
            //res.send(data);
        }
    */

    // res.render('Admin/AdminLogin');
});
router.get('/AdminLogout', (req, res, next) => {
    //console.log("admin");
    req.session.destroy();
    res.redirect('/Admin');
});


module.exports = router;
