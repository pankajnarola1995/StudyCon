let express = require('express'),
    router = express.Router(),
    Consultancy = require('../../model/Admin/AdminConsultancy'),
    Image = require('../../model/Admin/AdminImages');
const mongoose = require('mongoose');

let assert = require('assert');
let fileUpload = require('express-fileupload');
router.use(fileUpload());


//let searchable = require('mongoose-searchable');

//let Consultancy = require('model/Admin/consultancy');
//router.use('/Admin/AdminConsultancy', require('./Admin/AdminConsultancy'))


/* GET Consultancy listing. */
router.get('/', function (req, res, next) {
    if (req.session.EmailId) //&& (req.session.Password)
    {

        Consultancy.find(function (err, Consultancydata) {
            if (Consultancydata) {
                console.log("Consultancy Data Fetched: Admin");

                res.render('Admin/AdminConsultancy', {Consultancy: Consultancydata});
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

//Consultancy Insert data
/*  router.post('/AdminConsultancyAddData', function (req, res) {
      console.log("AdminConsultancyAddData");

      if (!req.files)
          return res.status(400).send('No files were uploaded.');

      let flage_image1 = req.files.flage_image;
      console.log(flage_image1);
      // Use the mv() method to place the file somewhere on your server
      let newpath = './public\\images\\' + flage_image1.name;
      flage_image1.mv(newpath, function (err) {
          if (err)
              return res.status(500).send(err);

          console.log('File uploaded Flage Image Consultancy!');
      });


      let consultancyData = new Consultancy({
          country_name: req.body.country_name,
          flage_image: flage_image1.name,
          requirenment: req.body.requirenment,
          detail: req.body.detail,
          important_link: req.body.important_link,
          images: images.name
      });
      console.log(consultancyData);

      let promise = consultancyData.save();
      assert.ok(promise instanceof require('mpromise'));

      if (promise) {
          console.log("inserted country data");
          res.redirect("/AdminConsultancy");
      }
      else {
          console.log("error in insert country");
          res.redirect("/AdminConsultancy");

      }
  });
*/

//Consultancy Insert data
/*
router.post('/AdminConsultancyAddData',  (req, res) => {

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

            console.log('File uploaded Flage Image Consultancy!');


        });
    };
    res.redirect("/AdminConsultancy");


    //console.log(req.files.images);


    //res.send(req.files.name);

});
*/
router.post('/AdminConsultancyAddData', (req, res) => {
    if (req.session.EmailId) //&& (req.session.Password)
    {

        if (req.files.images.length >= 2) {

            let images = req.files.images;
            let flage_image1 = req.files.flage_image;
            let mul_newpath = new Array();
            let newpath = './public\\images\\Consultancy_Flag\\' + flage_image1.name;

            flage_image1.mv(newpath, function (err) {
                if (err)
                    return res.status(500).send(err);

                console.log('File uploaded: Flage Image Consultancy!');
            });
//Consultancy Data Inserted
            let consultancyData = new Consultancy({
                _id: new mongoose.Types.ObjectId,
                country_name: req.body.country_name,
                flage_image: flage_image1.name,
                requirenment: req.body.requirenment,
                detail: req.body.detail,
                important_link: req.body.important_link,
            });
            console.log(consultancyData);

            let promise = consultancyData.save();
            assert.ok(promise instanceof require('mpromise'));
            promise.then(function (result) {
                console.log("inserted Consultancy data"); // "Stuff worked!"
            }, function (err) {
                console.log(err); // Error: "It broke"
            });
// For loop For Multiple File Uploading
            for (let i = 0; i < req.files.images.length; i++) {
                mul_newpath[i] = './public\\images\\Consultancy\\' + images[i].name;
                console.log(mul_newpath[i]);
                images[i].mv(mul_newpath[i], function (err) {

                    let image_name = images[i].name;
                    let imagedata = new Image({
                        consultancy_id: consultancyData._id,    // assign the _id from the person
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
            res.redirect("/Admin/AdminConsultancy");
        }else {
            res.send("Please Select 2 or More than 2 Files To Upload Multiple Files");
        }
    }
    else {
        res.redirect('/Admin');
    }

});

//Consultancy Delete data
router.post('/AdminConsultancyDeleteData', (req, res) => {
    if (req.session.EmailId) {
        let cid = req.body.cid;
        console.log(cid);
        Consultancy.remove({_id: cid}, function (err) {
            if (err) {
                res.json({"err": err});
            } else {
                Image.remove({consultancy_id: cid}, function (err) {
                    res.json({success: true});
                });
            }

        });
    }
    else {
        res.redirect('/Admin');
    }

    //Consultancy.findByIdAndRemove(cid).then((docs) => {});

    //Consultancy.delete(function(err,Consultancy){
    // if(err) throw err;
    // console.log('the document is deleted');
    //res.send(question);

    //});


});

//Consultancy Update Get data
router.post('/AdminConsultancyUpdateGetData', (req, res) => {
    console.log("Ajax working");
    if (req.session.EmailId) {

        let cid = req.body.cid;
        console.log(cid);
        Consultancy.find({_id: cid}, function (err, data) {
            if (err) {
                res.json({"err": err});
            } else {
                //console.log(data);
                res.send({Consultancy: data});
            }

        });
    } else {
        res.redirect("/Admin");
    }
});
//Consultancy Update Get Images
router.post('/AdminConsultancyUpdateGetImages', (req, res) => {
    // console.log("Ajax working:AdminConsultancyUpdateGetImages ");

    if (req.session.EmailId) {
        let cid = req.body.cid;
        console.log(cid);

        Image.find({consultancy_id: cid}, function (err, data) {
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
//Consultancy multiple Delete Images
router.post('/AdminConsultancyDeleteImage', (req, res) => {
    if (req.session.EmailId) {
        let Iid = req.body.Iid;
        console.log(Iid);
        Image.remove({_id: Iid}, function (err) {
            if (err) {
                res.json({"err": err});
            } else {
                res.redirect("/Admin/AdminConsultancy")
            }

        });
    } else {
        res.redirect('/Admin');
    }

});
router.post('/AdminConsultancyDeleteAllImages', (req, res) => {

    let cid = req.body.cid;
    console.log(cid);
    Image.remove({consultancy_id: cid}, function (err) {
        if (err) {
            res.json({"err": err});
        } else {
            res.redirect("/Admin/AdminConsultancy")
        }

    });


});


//Consultancy Update New Multiple Images
router.post('/AdminConsultancyUpdateImages', (req, res) => {


    if (req.session.EmailId) {
        if (req.files.images.length >= 2) {

            let images = req.files.images;
            let mul_newpath = new Array();
            console.log(req.body.cid1);

// For loop For Multiple File Uploading
            for (let i = 0; i < req.files.images.length; i++) {
                mul_newpath[i] = './public\\images\\Consultancy\\' + images[i].name;
                console.log(mul_newpath[i]);
                images[i].mv(mul_newpath[i], function (err) {

                    let image_name = images[i].name;
                    let imagedata = new Image({
                        consultancy_id: req.body.cid1,    // assign the _id from the person
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
            res.redirect("/Admin/AdminConsultancy");

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


//Consultancy Update data
router.post('/AdminConsultancyUpdateData', (req, res) => {
    if (req.session.EmailId) {
        if (req.files.flage_image) {
            let flage_image1 = req.files.flage_image;
            let mul_newpath = new Array();
            console.log(flage_image1);
            let newpath = './public\\images\\Consultancy_Flag\\' + flage_image1.name;

            flage_image1.mv(newpath, function (err) {
                if (err)
                    return res.status(500).send(err);

                console.log('File uploaded: Flage Image Consultancy!');
            });
            const flage_img = {
                flage_image: flage_image1.name,
            };
            Consultancy.update({_id: req.body.id}, flage_img, function (err, data) {
                console.log("Flage Image Updated");

            });

        }
        const doc = {
            id: req.body.id,
            country_name: req.body.country_name,
            requirenment: req.body.requirenment,
            detail: req.body.detail,
            important_link: req.body.important_link,
        };
        Consultancy.update({_id: req.body.id}, doc, function (err, data) {

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
                console.log("updated Consultancy data");
                res.redirect("/Admin/AdminConsultancy");
            }
            else {
                console.log("error in updated Consultancy");
                res.send(err);
            }
        });

    }
    else {
        res.redirect('/Admin');
    }

});

module.exports = router;
