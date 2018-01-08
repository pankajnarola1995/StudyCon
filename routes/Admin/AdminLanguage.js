let express = require('express'),
    router = express.Router(),
    Language = require('../../model/Admin/AdminLanguage'),
    Image = require('../../model/Admin/AdminImages');
const mongoose = require('mongoose');

let assert = require('assert');
let fileUpload = require('express-fileupload');
router.use(fileUpload());


//let searchable = require('mongoose-searchable');

//let Language = require('model/Admin/Language');
//router.use('/Admin/AdminLanguage', require('./Admin/AdminLanguage'))


/* GET Language listing. */
router.get('/', function (req, res, next) {
    if (req.session.EmailId) //&& (req.session.Password)
    {

        Language.find(function (err, Languagedata) {
            if (Languagedata) {
                console.log("Language Data Fetched: Admin");

                res.render('Admin/AdminLanguage', {Language: Languagedata});
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

//Language Insert data
/*  router.post('/AdminLanguageAddData', function (req, res) {
      console.log("AdminLanguageAddData");

      if (!req.files)
          return res.status(400).send('No files were uploaded.');

      let flage_image1 = req.files.flage_image;
      console.log(flage_image1);
      // Use the mv() method to place the file somewhere on your server
      let newpath = './public\\images\\' + flage_image1.name;
      flage_image1.mv(newpath, function (err) {
          if (err)
              return res.status(500).send(err);

          console.log('File uploaded Flage Image Language!');
      });


      let LanguageData = new Language({
          Language_name: req.body.Language_name,
          flage_image: flage_image1.name,
          requirenment: req.body.requirenment,
          detail: req.body.detail,
          important_link: req.body.important_link,
          images: images.name
      });
      console.log(LanguageData);

      let promise = LanguageData.save();
      assert.ok(promise instanceof require('mpromise'));

      if (promise) {
          console.log("inserted Language data");
          res.redirect("/AdminLanguage");
      }
      else {
          console.log("error in insert Language");
          res.redirect("/AdminLanguage");

      }
  });
*/

//Language Insert data
/*
router.post('/AdminLanguageAddData',  (req, res) => {

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

            console.log('File uploaded Flage Image Language!');


        });
    };
    res.redirect("/AdminLanguage");


    //console.log(req.files.images);


    //res.send(req.files.name);

});
*/
router.post('/AdminLanguageAddData', (req, res) => {
        if (req.session.EmailId) //&& (req.session.Password)
        {

            if (req.files.images.length >= 2) {

                let images = req.files.images;
                let flage_image1 = req.files.flage_image;
                let mul_newpath = new Array();
                let newpath = './public\\images\\Language_Flag\\' + flage_image1.name;

                flage_image1.mv(newpath, function (err) {
                    if (err)
                        return res.status(500).send(err);

                    console.log('File uploaded: Flage Image Language!');
                });
//Language Data Inserted
                let LanguageData = new Language({
                    _id: new mongoose.Types.ObjectId,
                    Language_name: req.body.Language_name,
                    flage_image: flage_image1.name,
                    requirenment: req.body.requirenment,
                    detail: req.body.detail,
                    important_link: req.body.important_link,
                });
                console.log(LanguageData);

                let promise = LanguageData.save();
                assert.ok(promise instanceof require('mpromise'));
                promise.then(function (result) {
                    console.log("inserted Language data"); // "Stuff worked!"
                }, function (err) {
                    console.log(err); // Error: "It broke"
                });
// For loop For Multiple File Uploading
                for (let i = 0; i < req.files.images.length; i++) {
                    mul_newpath[i] = './public\\images\\Language\\' + images[i].name;
                    console.log(mul_newpath[i]);
                    images[i].mv(mul_newpath[i], function (err) {

                        let image_name = images[i].name;
                        let imagedata = new Image({
                            Language_id: LanguageData._id,    // assign the _id from the person
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
                res.redirect("/Admin/AdminLanguage");
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

//Language Delete data
router.post('/AdminLanguageDeleteData', (req, res) => {
    if (req.session.EmailId) {
        let lid = req.body.lid;
        console.log(lid);
        Language.remove({_id: lid}, function (err) {
            if (err) {
                res.json({"err": err});
            } else {
                Image.remove({Language_id: lid}, function (err) {
                    res.json({success: true});
                });
            }

        });
    }
    else {
        res.redirect('/Admin');
    }

    //Language.findByIdAndRemove(lid).then((docs) => {});

    //Language.delete(function(err,Language){
    // if(err) throw err;
    // console.log('the document is deleted');
    //res.send(question);

    //});


});

//Language Update Get data
router.post('/AdminLanguageUpdateGetData', (req, res) => {
    console.log("Ajax working");
    if (req.session.EmailId) {

        let lid = req.body.lid;
        console.log(lid);
        Language.find({_id: lid}, function (err, data) {
            if (err) {
                res.json({"err": err});
            } else {
                //console.log(data);
                res.send({Language: data});
            }

        });
    } else {
        res.redirect("/Admin");
    }
});
//Language Update Get Images
router.post('/AdminLanguageUpdateGetImages', (req, res) => {
    // console.log("Ajax working:AdminLanguageUpdateGetImages ");

    if (req.session.EmailId) {
        let lid = req.body.lid;
        console.log(lid);

        Image.find({Language_id: lid}, function (err, data) {
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
//Language multiple Delete Images
router.post('/AdminLanguageDeleteImage', (req, res) => {
    if (req.session.EmailId) {
        let Iid = req.body.Iid;
        console.log(Iid);
        Image.remove({_id: Iid}, function (err) {
            if (err) {
                res.json({"err": err});
            } else {
                res.redirect("/Admin/AdminLanguage")
            }

        });
    } else {
        res.redirect('/Admin');
    }

});
router.post('/AdminLanguageDeleteAllImages', (req, res) => {

    let lid = req.body.lid;
    console.log(lid);
    Image.remove({Language_id: lid}, function (err) {
        if (err) {
            res.json({"err": err});
        } else {
            res.redirect("/Admin/AdminLanguage")
        }

    });


});


//Language Update New Multiple Images
router.post('/AdminLanguageUpdateImages', (req, res) => {


    if (req.session.EmailId) {
        if (req.files.images.length >= 2) {

            let images = req.files.images;
            let mul_newpath = new Array();
            console.log(req.body.lid1);

// For loop For Multiple File Uploading
            for (let i = 0; i < req.files.images.length; i++) {
                mul_newpath[i] = './public\\images\\Language\\' + images[i].name;
                console.log(mul_newpath[i]);
                images[i].mv(mul_newpath[i], function (err) {

                    let image_name = images[i].name;
                    let imagedata = new Image({
                        Language_id: req.body.lid1,    // assign the _id from the person
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
            res.redirect("/Admin/AdminLanguage");

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


//Language Update data
router.post('/AdminLanguageUpdateData', (req, res) => {
    if (req.session.EmailId) {
        if (req.files.flage_image) {
            let flage_image1 = req.files.flage_image;
            let mul_newpath = new Array();
            console.log(flage_image1);
            let newpath = './public\\images\\Language_Flag\\' + flage_image1.name;

            flage_image1.mv(newpath, function (err) {
                if (err)
                    return res.status(500).send(err);

                console.log('File uploaded: Flage Image Language!');
            });
            const flage_img = {
                flage_image: flage_image1.name,
            };
            Language.update({_id: req.body.id}, flage_img, function (err, data) {
                console.log("Flage Image Updated");

            });

        }
        const doc = {
            id: req.body.id,
            Language_name: req.body.Language_name,
            requirenment: req.body.requirenment,
            detail: req.body.detail,
            important_link: req.body.important_link,
        };
        Language.update({_id: req.body.id}, doc, function (err, data) {

            /*   let promise = Language.update({'Language_name': Language_name},
               {
                   $set: {
                       'Language_name': Language_name,
                       'flage_image': flage_image,
                       'requirenment': requirenment,
                       'detail': detail,
                       'important_link': important_link
                   }
               });
           assert.ok(promise instanceof require('mpromise'));
       */
            if (!err) {
                console.log("updated Language data");
                res.redirect("/Admin/AdminLanguage");
            }
            else {
                console.log("error in updated Language");
                res.send(err);
            }
        });

    }
    else {
        res.redirect('/Admin');
    }

});

module.exports = router;
