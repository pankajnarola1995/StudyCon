let express = require('express'),
    router = express.Router(),
    AddEvent = require('../../model/Admin/AdminAddEvent'),
    Image = require('../../model/Admin/AdminImages');
const mongoose = require('mongoose');

let assert = require('assert');
let fileUpload = require('express-fileupload');
router.use(fileUpload());


/* GET AddEvent listing. */
router.get('/', function (req, res, next) {
    if (req.session.EmailId) //&& (req.session.Password)
    {

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
        if (req.session.EmailId) //&& (req.session.Password)
        {

            if (req.files.images.length >= 2) {

                let images = req.files.images;
                let mul_newpath = new Array();

//AddEvent Data Inserted
                let AddEventData = new AddEvent({
                    _id: new mongoose.Types.ObjectId,
                    event_name: req.body.event_name,
                    event_description: req.body.event_description,
                    event_type: req.body.event_type,
                    event_start: req.body.event_start,
                    event_end: req.body.event_end,
                    event_details: req.body.event_details,
                });
                console.log(AddEventData);

                let promise = AddEventData.save();
                assert.ok(promise instanceof require('mpromise'));
                promise.then(function (result) {
                    console.log("inserted AddEvent data"); // "Stuff worked!"
                }, function (err) {
                    console.log(err); // Error: "It broke"
                });
// For loop For Multiple File Uploading
                for (let i = 0; i < req.files.images.length; i++) {
                    mul_newpath[i] = './public\\images\\AddEvent\\' + images[i].name;
                    console.log(mul_newpath[i]);
                    images[i].mv(mul_newpath[i], function (err) {

                        let image_name = images[i].name;
                        let imagedata = new Image({
                            AddEvent_id: AddEventData._id,    // assign the _id from the person
                            images_name: image_name,
                        });
                        imagedata.save(function (error, res) {
                            if (error) {
                                console.log("image insert error ");
                                res.send(error);

                            }
                            else {

                                console.log("Multiple image inserted " + [i]);
                            }
                        });
                    });
                }
                ;
                console.log("Everything Done");
                res.redirect("/Admin/AdminAddEvent");
            }
            else {
                res.send("Please Select 2 or More than 2 Files To Upload Multiple Files");

            }
        }
        else {
            res.redirect('/Admin');
        }

    }
);

//AddEvent Delete data
router.post('/AdminAddEventDeleteData', (req, res) => {
    if (req.session.EmailId) {
        let eid = req.body.eid;
        console.log(eid);
        AddEvent.remove({_id: eid}, function (err) {
            if (err) {
                res.json({"err": err});
            } else {
                Image.remove({AddEvent_id: eid}, function (err) {
                    res.json({success: true});
                });
            }

        });
    }
    else {
        res.redirect('/Admin');
    }

    //AddEvent.findByIdAndRemove(eid).then((docs) => {});

    //AddEvent.delete(function(err,AddEvent){
    // if(err) throw err;
    // console.log('the document is deleted');
    //res.send(question);

    //});


});

//AddEvent Update Get data
router.post('/AdminAddEventUpdateGetData', (req, res) => {
    console.log("Ajax working");
    if (req.session.EmailId) {

        let eid = req.body.eid;
        console.log(eid);
        AddEvent.find({_id: eid}, function (err, data) {
            if (err) {
                res.json({"err": err});
            } else {
                console.log(data);
                res.send({AddEvent: data});
            }

        });
    } else {
        res.redirect("/Admin");
    }
});
//AddEvent Update Get Images
router.post('/AdminAddEventUpdateGetImages', (req, res) => {
    // console.log("Ajax working:AdminAddEventUpdateGetImages ");

    if (req.session.EmailId) {
        let eid = req.body.eid;
        console.log(eid);

        Image.find({AddEvent_id: eid}, function (err, data) {
            if (err) {
                res.json({"err": err});
            } else {
                console.log(data);
                res.send(data);

                //res.send(data);
            }
        });
    } else {
        res.redirect('/Admin');
    }
});
//AddEvent multiple Delete Images
router.post('/AdminAddEventDeleteImage', (req, res) => {
    if (req.session.EmailId) {
        let Iid = req.body.Iid;
        console.log(Iid);
        Image.remove({_id: Iid}, function (err) {
            if (err) {
                res.json({"err": err});
            } else {
                res.redirect("/Admin/AdminAddEvent")
            }

        });
    } else {
        res.redirect('/Admin');
    }

});
router.post('/AdminAddEventDeleteAllImages', (req, res) => {

    let eid = req.body.eid;
    console.log(eid);
    Image.remove({AddEvent_id: eid}, function (err) {
        if (err) {
            res.json({"err": err});
        } else {
            res.redirect("/Admin/AdminAddEvent")
        }

    });


});


//AddEvent Update New Multiple Images
router.post('/AdminAddEventUpdateImages', (req, res) => {


    if (req.session.EmailId) {
        if (req.files.images.length >= 2) {

            let images = req.files.images;
            let mul_newpath = new Array();
            console.log(req.body.eid1);

// For loop For Multiple File Uploading
            for (let i = 0; i < req.files.images.length; i++) {
                mul_newpath[i] = './public\\images\\AddEvent\\' + images[i].name;
                console.log(mul_newpath[i]);
                images[i].mv(mul_newpath[i], function (err) {

                    let image_name = images[i].name;
                    let imagedata = new Image({
                        AddEvent_id: req.body.eid1,    // assign the _id from the person
                        images_name: image_name,
                    });
                    console.log(imagedata);

                    let promise = imagedata.save();
                    assert.ok(promise instanceof require('mpromise'));
                    promise.then(function (result) {
                        console.log("Multiple image inserted " + [i]);// "Stuff worked!"
                    }, function (err) {
                        console.log(err); // Error: "It broke"
                    });

                });
            }
            ;
            console.log("Everything Done");
            res.redirect("/Admin/AdminAddEvent");

        }
        else {
            //   alert("Please Select 2 or More than 2 Files");
            res.send("Please Select 2 or More than 2 Files To Upload Multiple Files");

        }

    } else {
        res.redirect('/Admin');
    }
//location.reload();

});


//AddEvent Update data
router.post('/AdminAddEventUpdateData', (req, res) => {
    if (req.session.EmailId) {
       const doc = {
            id: req.body.eid,
           event_name: req.body.event_name,
           event_description: req.body.event_description,
           event_type: req.body.event_type,
           event_start: req.body.event_start,
           event_end: req.body.event_end,
           event_details: req.body.event_details,
       };
        AddEvent.update({_id: req.body.eid}, doc, function (err, data) {

            /*   let promise = AddEvent.update({'AddEvent_name': AddEvent_name},
               {
                   $set: {
                       'AddEvent_name': AddEvent_name,
                       'flage_image': flage_image,
                       'requirenment': requirenment,
                       'detail': detail,
                       'important_link': important_link
                   }
               });
           assert.ok(promise instanceof require('mpromise'));
       */
            if (!err) {
                console.log("updated AddEvent data");
                res.redirect("/Admin/AdminAddEvent");
            }
            else {
                console.log("error in updated AddEvent");
                res.send(err);
            }
        });

    }
    else {
        res.redirect('/Admin');
    }

});

module.exports = router;
