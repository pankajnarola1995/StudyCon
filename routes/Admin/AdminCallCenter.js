let express = require('express'),
    router = express.Router(),
    CallCenter = require('../../model/Admin/AdminCallCenter'),
    Image = require('../../model/Admin/AdminImages');
const mongoose = require('mongoose');

let assert = require('assert');
let fileUpload = require('express-fileupload');
router.use(fileUpload());


//let searchable = require('mongoose-searchable');

//let CallCenter = require('model/Admin/CallCenter');
//router.use('/Admin/AdminCallCenter', require('./Admin/AdminCallCenter'))


/* GET CallCenter listing. */
router.get('/', function (req, res, next) {
    if (req.session.EmailId) //&& (req.session.Password)
    {

        CallCenter.find(function (err, CallCenterdata) {
            if (CallCenterdata) {
                console.log("CallCenter Data Fetched: Admin");

                res.render('Admin/AdminCallCenter', {CallCenter: CallCenterdata});
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

//CallCenter Insert data
/*  router.post('/AdminCallCenterAddData', function (req, res) {
      console.log("AdminCallCenterAddData");

      if (!req.files)
          return res.status(400).send('No files were uploaded.');

      let flage_image1 = req.files.flage_image;
      console.log(flage_image1);
      // Use the mv() method to place the file somewhere on your server
      let newpath = './public\\images\\' + flage_image1.name;
      flage_image1.mv(newpath, function (err) {
          if (err)
              return res.status(500).send(err);

          console.log('File uploaded Flage Image CallCenter!');
      });


      let CallCenterData = new CallCenter({
          CallCenter_name: req.body.CallCenter_name,
          flage_image: flage_image1.name,
          requirenment: req.body.requirenment,
          detail: req.body.detail,
          important_link: req.body.important_link,
          images: images.name
      });
      console.log(CallCenterData);

      let promise = CallCenterData.save();
      assert.ok(promise instanceof require('mpromise'));

      if (promise) {
          console.log("inserted CallCenter data");
          res.redirect("/AdminCallCenter");
      }
      else {
          console.log("error in insert CallCenter");
          res.redirect("/AdminCallCenter");

      }
  });
*/

//CallCenter Insert data
/*
router.post('/AdminCallCenterAddData',  (req, res) => {

    let images = req.files.images.length;
    console.log(images);
    let newpath = new Array();

    for (let i = 0; i < req.files.images.length; i++) {

        newpath[i] = './public\\images\\' + images[i].name;
        console.log(newpath[i]);
        images[i].mv(newpath[i], function (err) {
            let image_name = images[i].name;
            let imagedata = new  Image({
                images_name: image_name,
            });
            imagedata.save(function (error, data) {
                if (error) {
                    console.log("image insert error ");
                    res.json(error);

                }
                else {
                    console.log("image inserted ");
                }
            });

            console.log('File uploaded Flage Image CallCenter!');


        });
    };
    res.redirect("/AdminCallCenter");


    //console.log(req.files.images);


    //res.send(req.files.name);

});
*/
router.post('/AdminCallCenterAddData', (req, res) => {
    if (req.session.EmailId) //&& (req.session.Password)
    {

        if (req.files.images.length >= 2) {

            let images = req.files.images;
            let flage_image1 = req.files.flage_image;
            let mul_newpath = new Array();
            let newpath = './public\\images\\CallCenter_Flag\\' + flage_image1.name;

            flage_image1.mv(newpath, function (err) {
                if (err)
                    return res.status(500).send(err);

                console.log('File uploaded: Flage Image CallCenter!');
            });
//CallCenter Data Inserted
            let CallCenterData = new CallCenter({
                _id: new mongoose.Types.ObjectId,
                CallCenter_name: req.body.CallCenter_name,
                flage_image: flage_image1.name,
                requirenment: req.body.requirenment,
                detail: req.body.detail,
                important_link: req.body.important_link,
            });
            console.log(CallCenterData);

            let promise = CallCenterData.save();
            assert.ok(promise instanceof require('mpromise'));
            promise.then(function (result) {
                console.log("inserted CallCenter data"); // "Stuff worked!"
            }, function (err) {
                console.log(err); // Error: "It broke"
            });
// For loop For Multiple File Uploading
            for (let i = 0; i < req.files.images.length; i++) {
                mul_newpath[i] = './public\\images\\CallCenter\\' + images[i].name;
                console.log(mul_newpath[i]);
                images[i].mv(mul_newpath[i], function (err) {

                    let image_name = images[i].name;
                    let imagedata = new Image({
                        CallCenter_id: CallCenterData._id,    // assign the _id from the person
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
            res.redirect("/Admin/AdminCallCenter");
        } else {
            res.send("Please Select 2 or More than 2 Files To Upload Multiple Files");

        }
    }
    else {
        res.redirect('/Admin');
    }

});

//CallCenter Delete data
router.post('/AdminCallCenterDeleteData', (req, res) => {
    if (req.session.EmailId) {
        let cid = req.body.cid;
        console.log(cid);
        CallCenter.remove({_id: cid}, function (err) {
            if (err) {
                res.json({"err": err});
            } else {
                Image.remove({CallCenter_id: cid}, function (err) {
                    res.json({success: true});
                });
            }

        });
    }
    else {
        res.redirect('/Admin');
    }

    //CallCenter.findByIdAndRemove(cid).then((docs) => {});

    //CallCenter.delete(function(err,CallCenter){
    // if(err) throw err;
    // console.log('the document is deleted');
    //res.send(question);

    //});


});

//CallCenter Update Get data
router.post('/AdminCallCenterUpdateGetData', (req, res) => {
    console.log("Ajax working");
    if (req.session.EmailId) {

        let cid = req.body.cid;
        console.log(cid);
        CallCenter.find({_id: cid}, function (err, data) {
            if (err) {
                res.json({"err": err});
            } else {
                //console.log(data);
                res.send({CallCenter: data});
            }

        });
    } else {
        res.redirect("/Admin");
    }
});
//CallCenter Update Get Images
router.post('/AdminCallCenterUpdateGetImages', (req, res) => {
    // console.log("Ajax working:AdminCallCenterUpdateGetImages ");

    if (req.session.EmailId) {
        let cid = req.body.cid;
        console.log(cid);

        Image.find({CallCenter_id: cid}, function (err, data) {
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
//CallCenter multiple Delete Images
router.post('/AdminCallCenterDeleteImage', (req, res) => {
    if (req.session.EmailId) {
        let Iid = req.body.Iid;
        console.log(Iid);
        Image.remove({_id: Iid}, function (err) {
            if (err) {
                res.json({"err": err});
            } else {
                res.redirect("/Admin/AdminCallCenter")
            }

        });
    } else {
        res.redirect('/Admin');
    }

});
router.post('/AdminCallCenterDeleteAllImages', (req, res) => {

    let cid = req.body.cid;
    console.log(cid);
    Image.remove({CallCenter_id: cid}, function (err) {
        if (err) {
            res.json({"err": err});
        } else {
            res.redirect("/Admin/AdminCallCenter")
        }

    });


});


//CallCenter Update New Multiple Images
router.post('/AdminCallCenterUpdateImages', (req, res) => {


    if (req.session.EmailId) {
        if (req.files.images.length >= 2) {

            let images = req.files.images;
            let mul_newpath = new Array();
            console.log(req.body.cid1);

// For loop For Multiple File Uploading
            for (let i = 0; i < req.files.images.length; i++) {
                mul_newpath[i] = './public\\images\\CallCenter\\' + images[i].name;
                console.log(mul_newpath[i]);
                images[i].mv(mul_newpath[i], function (err) {

                    let image_name = images[i].name;
                    let imagedata = new Image({
                        CallCenter_id: req.body.cid1,    // assign the _id from the person
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
            res.redirect("/Admin/AdminCallCenter");

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


//CallCenter Update data
router.post('/AdminCallCenterUpdateData', (req, res) => {
    if (req.session.EmailId) {
        if (req.files.flage_image) {
            let flage_image1 = req.files.flage_image;
            let mul_newpath = new Array();
            console.log(flage_image1);
            let newpath = './public\\images\\CallCenter_Flag\\' + flage_image1.name;

            flage_image1.mv(newpath, function (err) {
                if (err)
                    return res.status(500).send(err);

                console.log('File uploaded: Flage Image CallCenter!');
            });
            const flage_img = {
                flage_image: flage_image1.name,
            };
            CallCenter.update({_id: req.body.id}, flage_img, function (err, data) {
                console.log("Flage Image Updated");

            });

        }
        const doc = {
            id: req.body.id,
            CallCenter_name: req.body.CallCenter_name,
            requirenment: req.body.requirenment,
            detail: req.body.detail,
            important_link: req.body.important_link,
        };
        CallCenter.update({_id: req.body.id}, doc, function (err, data) {

            /*   let promise = CallCenter.update({'CallCenter_name': CallCenter_name},
               {
                   $set: {
                       'CallCenter_name': CallCenter_name,
                       'flage_image': flage_image,
                       'requirenment': requirenment,
                       'detail': detail,
                       'important_link': important_link
                   }
               });
           assert.ok(promise instanceof require('mpromise'));
       */
            if (!err) {
                console.log("updated CallCenter data");
                res.redirect("/Admin/AdminCallCenter");
            }
            else {
                console.log("error in updated CallCenter");
                res.send(err);
            }
        });

    }
    else {
        res.redirect('/Admin');
    }

});

module.exports = router;
