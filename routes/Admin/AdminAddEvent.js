var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var assert = require('assert');
let AddEventSchema = mongoose.Schema({

    event_name: String,
    event_start: String,
    event_end: String,
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
});




router.post('/AdminAddEventAddData', (req, res) => {
    console.log("AdminAddEventAddData");

    let AddEventData = new AddEvent({
        event_name: req.body.event_name,
        event_description: req.body.event_description,
        event_type: req.body.event_type,
        event_start: req.body.event_start,
        event_end: req.body.event_end,
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


});


//Addevent Delete data
router.post('/AdminAddEventDeleteData', (req, res) => {

    let eid = req.body.eid;
    console.log(eid);
    AddEvent.remove({_id: eid}, function (err) {
        if (err) {
            res.json({"err": err});
        } else {
            Image.remove({addEvent_id: eid}, function (err) {
                res.json({success: true});
            });
        }

    });
    //AddEvent.findByIdAndRemove(cid).then((docs) => {});

    //AddEvent.delete(function(err,Consultancy){
    // if(err) throw err;
    // console.log('the document is deleted');
    //res.send(question);

    //});


});

//AddEvent Update Get data
router.post('/AdminAddEventUpdateGetData', (req, res) => {
    console.log("Ajax working");


    let eid = req.body.eid;
    console.log(eid);
    AddEvent.find({_id: eid}, function (err, data) {
        if (err) {
            res.json({"err": err});
        } else {
            //console.log(data);
            res.send({AddEvent: data});
        }

    });
});
//AddEvent Update Get Images
router.post('/AdminAddEventUpdateGetImages', (req, res) => {
    console.log("Ajax working:AdminAddEventUpdateGetImages ");


    let eid = req.body.eid;
    console.log(eid);
    Image.find({addEvent_id_id: eid}, function (err, data) {
        if (err) {
            res.json({"err": err});
        } else {
            console.log(data);
            res.send({Image: data});
        }

    });
});

// Update data
router.post('/AdminAddEventUpdateData', (req, res) => {

    //   images:         req.body.imagesnpm install googleapis --save

    // console.log(addeventData);
    // let images = req.files.images;
    let flage_image1 = req.files;
    let mul_newpath = new Array();
    console.log(flage_image1);
    let newpath = './public\\images\\Consultancy_Flag\\' + flage_image1.name;

    event_image.mv(newpath, function (err) {
        if (err)
            return res.status(500).send(err);

        console.log('File uploaded: Event Image!');
    });
    const doc = {
        id: req.body.id,
        country_name: req.body.country_name,
        flage_image: flage_image1.name,
        requirenment: req.body.requirenment,
        detail: req.body.detail,
        important_link: req.body.important_link,
    };
    console.log(doc);
    AddEvent.update({_id: req.body.id}, doc, function (err, data) {

        /*   let promise = Consultancy.update({'country_name': country_name},
           {
               $set: {
                   'country_name': country_name,
                   'flage_image': flage_image,
                   'requirenment': requirenment,
                   'detail': detail,
                   'important_link': important_link
               }
           });
       assert.ok(promise instanceof require('mpromise'));
   */
        if (!err) {
            console.log("Event Updated");
            res.redirect("/AdminAddEvent");
        }
        else {
            console.log("error in updated Event");
            res.send(err);
        }
    });
});


module.exports = router;

