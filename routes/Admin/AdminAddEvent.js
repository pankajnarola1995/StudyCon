var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var assert = require('assert');
let AddEventSchema = mongoose.Schema({

    event_name: String,
    event_description: String,
    event_type: String,
    event_details: String,
    images: String,
    // images:String

});

//Admin Event handling

let AddEvent = mongoose.model("AddEvent", AddEventSchema);


/* GET users listing. */
router.get('/', function (req, res, next) {
    //console.log("admin");

    if (req.session.EmailId) //&& (req.session.Password)
    {
        //console.log("admin");

        var AddEvent = mongoose.model("AddEvent");

        AddEvent.find(function (err, AddEventdata) {
            if (AddEventdata) {
                console.log("AddEvent Data Fetched: Admin");

                res.render('Admin/AdminAddEvent', {AddEvent: AddEventdata});
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


router.post('/AdminAddEventAddData', (req, res) => {
    console.log("AdminAddEventAddData");
    if(req.session.EmailId) //&& (req.session.Password)
    {
        //console.log("admin");
    let AddEventData = new AddEvent({
        event_name: req.body.event_name,
        event_description: req.body.event_description,
        event_type: req.body.event_type,
        event_details: req.body.event_details,
        images: req.body.images,
        //   images:         req.body.images
    });
    console.log(AddEventData);
    let promise = AddEventData.save();
    assert.ok(promise instanceof require('mpromise'));

    if (promise) {
        console.log("inserted event data");
        res.redirect("/Admin/AdminAddEvent");
    }
    else {
        console.log("error in insert event");
        res.redirect("/Admin/AdminAddEvent");

    }
    }
    else {
        res.redirect('/Admin');
    }

});


module.exports = router;
