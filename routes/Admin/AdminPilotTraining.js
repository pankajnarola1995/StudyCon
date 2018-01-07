let express = require('express'),
    router = express.Router(),
    PilotTraining = require('../../model/Admin/AdminPilotTraining'),
    Image = require('../../model/Admin/AdminImages');
const mongoose = require('mongoose');

let assert = require('assert');
let fileUpload = require('express-fileupload');
router.use(fileUpload());


//let searchable = require('mongoose-searchable');

//let PilotTraining = require('model/Admin/PilotTraining');
//router.use('/Admin/AdminPilotTraining', require('./Admin/AdminPilotTraining'))


/* GET PilotTraining listing. */
router.get('/', function (req, res, next) {
    if (req.session.EmailId) //&& (req.session.Password)
    {

        PilotTraining.find(function (err, PilotTrainingdata) {
            if (PilotTrainingdata) {
                console.log("PilotTraining Data Fetched: Admin");

                res.render('Admin/AdminPilotTraining', {PilotTraining: PilotTrainingdata});
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

//PilotTraining Insert data
/*  router.post('/AdminPilotTrainingAddData', function (req, res) {
      console.log("AdminPilotTrainingAddData");

      if (!req.files)
          return res.status(400).send('No files were uploaded.');

      let flage_image1 = req.files.flage_image;
      console.log(flage_image1);
      // Use the mv() method to place the file somewhere on your server
      let newpath = './public\\images\\' + flage_image1.name;
      flage_image1.mv(newpath, function (err) {
          if (err)
              return res.status(500).send(err);

          console.log('File uploaded Flage Image PilotTraining!');
      });


      let PilotTrainingData = new PilotTraining({
          PilotTraining_name: req.body.PilotTraining_name,
          flage_image: flage_image1.name,
          requirenment: req.body.requirenment,
          detail: req.body.detail,
          important_link: req.body.important_link,
          images: images.name
      });
      console.log(PilotTrainingData);

      let promise = PilotTrainingData.save();
      assert.ok(promise instanceof require('mpromise'));

      if (promise) {
          console.log("inserted PilotTraining data");
          res.redirect("/AdminPilotTraining");
      }
      else {
          console.log("error in insert PilotTraining");
          res.redirect("/AdminPilotTraining");

      }
  });
*/

//PilotTraining Insert data
/*
router.post('/AdminPilotTrainingAddData',  (req, res) => {

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

            console.log('File uploaded Flage Image PilotTraining!');


        });
    };
    res.redirect("/AdminPilotTraining");


    //console.log(req.files.images);


    //res.send(req.files.name);

});
*/
router.post('/AdminPilotTrainingAddData', (req, res) => {
        if (req.session.EmailId) //&& (req.session.Password)
        {

            if (req.files.images.length >= 2) {

                let images = req.files.images;
                let flage_image1 = req.files.flage_image;
                let mul_newpath = new Array();
                let newpath = './public\\images\\PilotTraining_Flag\\' + flage_image1.name;

                flage_image1.mv(newpath, function (err) {
                    if (err)
                        return res.status(500).send(err);

                    console.log('File uploaded: Flage Image PilotTraining!');
                });
//PilotTraining Data Inserted
                let PilotTrainingData = new PilotTraining({
                    _id: new mongoose.Types.ObjectId,
                    PilotTraining_name: req.body.PilotTraining_name,
                    flage_image: flage_image1.name,
                    requirenment: req.body.requirenment,
                    detail: req.body.detail,
                    important_link: req.body.important_link,
                });
                console.log(PilotTrainingData);

                let promise = PilotTrainingData.save();
                assert.ok(promise instanceof require('mpromise'));
                promise.then(function (result) {
                    console.log("inserted PilotTraining data"); // "Stuff worked!"
                }, function (err) {
                    console.log(err); // Error: "It broke"
                });
// For loop For Multiple File Uploading
                for (let i = 0; i < req.files.images.length; i++) {
                    mul_newpath[i] = './public\\images\\PilotTraining\\' + images[i].name;
                    console.log(mul_newpath[i]);
                    images[i].mv(mul_newpath[i], function (err) {

                        let image_name = images[i].name;
                        let imagedata = new Image({
                            PilotTraining_id: PilotTrainingData._id,    // assign the _id from the person
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
                res.redirect("/Admin/AdminPilotTraining");
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

//PilotTraining Delete data
router.post('/AdminPilotTrainingDeleteData', (req, res) => {
    if (req.session.EmailId) {
        let pid = req.body.pid;
        console.log(pid);
        PilotTraining.remove({_id: pid}, function (err) {
            if (err) {
                res.json({"err": err});
            } else {
                Image.remove({PilotTraining_id: pid}, function (err) {
                    res.json({success: true});
                });
            }

        });
    }
    else {
        res.redirect('/Admin');
    }

    //PilotTraining.findByIdAndRemove(pid).then((docs) => {});

    //PilotTraining.delete(function(err,PilotTraining){
    // if(err) throw err;
    // console.log('the document is deleted');
    //res.send(question);

    //});


});

//PilotTraining Update Get data
router.post('/AdminPilotTrainingUpdateGetData', (req, res) => {
    console.log("Ajax working");
    if (req.session.EmailId) {

        let pid = req.body.pid;
        console.log(pid);
        PilotTraining.find({_id: pid}, function (err, data) {
            if (err) {
                res.json({"err": err});
            } else {
                //console.log(data);
                res.send({PilotTraining: data});
            }

        });
    } else {
        res.redirect("/Admin");
    }
});
//PilotTraining Update Get Images
router.post('/AdminPilotTrainingUpdateGetImages', (req, res) => {
    // console.log("Ajax working:AdminPilotTrainingUpdateGetImages ");

    if (req.session.EmailId) {
        let pid = req.body.pid;
        console.log(pid);

        Image.find({PilotTraining_id: pid}, function (err, data) {
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
//PilotTraining multiple Delete Images
router.post('/AdminPilotTrainingDeleteImage', (req, res) => {
    if (req.session.EmailId) {
        let Iid = req.body.Iid;
        console.log(Iid);
        Image.remove({_id: Iid}, function (err) {
            if (err) {
                res.json({"err": err});
            } else {
                res.redirect("/Admin/AdminPilotTraining")
            }

        });
    } else {
        res.redirect('/Admin');
    }

});
router.post('/AdminPilotTrainingDeleteAllImages', (req, res) => {

    let pid = req.body.pid;
    console.log(pid);
    Image.remove({PilotTraining_id: pid}, function (err) {
        if (err) {
            res.json({"err": err});
        } else {
            res.redirect("/Admin/AdminPilotTraining")
        }

    });


});


//PilotTraining Update New Multiple Images
router.post('/AdminPilotTrainingUpdateImages', (req, res) => {


    if (req.session.EmailId) {
        if (req.files.images.length >= 2) {

            let images = req.files.images;
            let mul_newpath = new Array();
            console.log(req.body.pid1);

// For loop For Multiple File Uploading
            for (let i = 0; i < req.files.images.length; i++) {
                mul_newpath[i] = './public\\images\\PilotTraining\\' + images[i].name;
                console.log(mul_newpath[i]);
                images[i].mv(mul_newpath[i], function (err) {

                    let image_name = images[i].name;
                    let imagedata = new Image({
                        PilotTraining_id: req.body.pid1,    // assign the _id from the person
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
            res.redirect("/Admin/AdminPilotTraining");

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


//PilotTraining Update data
router.post('/AdminPilotTrainingUpdateData', (req, res) => {
    if (req.session.EmailId) {
        if (req.files.flage_image) {
            let flage_image1 = req.files.flage_image;
            let mul_newpath = new Array();
            console.log(flage_image1);
            let newpath = './public\\images\\PilotTraining_Flag\\' + flage_image1.name;

            flage_image1.mv(newpath, function (err) {
                if (err)
                    return res.status(500).send(err);

                console.log('File uploaded: Flage Image PilotTraining!');
            });
            const flage_img = {
                flage_image: flage_image1.name,
            };
            PilotTraining.update({_id: req.body.id}, flage_img, function (err, data) {
                console.log("Flage Image Updated");

            });

        }
        const doc = {
            id: req.body.id,
            PilotTraining_name: req.body.PilotTraining_name,
            requirenment: req.body.requirenment,
            detail: req.body.detail,
            important_link: req.body.important_link,
        };
        PilotTraining.update({_id: req.body.id}, doc, function (err, data) {

            /*   let promise = PilotTraining.update({'PilotTraining_name': PilotTraining_name},
               {
                   $set: {
                       'PilotTraining_name': PilotTraining_name,
                       'flage_image': flage_image,
                       'requirenment': requirenment,
                       'detail': detail,
                       'important_link': important_link
                   }
               });
           assert.ok(promise instanceof require('mpromise'));
       */
            if (!err) {
                console.log("updated PilotTraining data");
                res.redirect("/Admin/AdminPilotTraining");
            }
            else {
                console.log("error in updated PilotTraining");
                res.send(err);
            }
        });

    }
    else {
        res.redirect('/Admin');
    }

});

module.exports = router;
