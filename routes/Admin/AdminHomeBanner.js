let express = require('express'),
    router = express.Router(),
    HomeBanner = require('../../model/Admin/AdminHomeBanner');

let fileUpload = require('express-fileupload');
router.use(fileUpload());

router.get('/', function (req, res, next) {
    //console.log("admin");

    if (req.session.EmailId) //&& (req.session.Password)
    {

        HomeBanner.find(function (err, HomeBannerdata) {
            if (HomeBannerdata) {
                console.log("HomeBanner Data Fetched: Admin");

                res.render('Admin/AdminHomeBanner', {HomeBanner: HomeBannerdata});
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

router.post('/AdminHomeBannerAddData', (req, res) => {
    if (req.session.EmailId) //&& (req.session.Password)
    {

        if (req.files.images.length >= 2) {

            let images = req.files.images;
            let mul_newpath = new Array();

// For loop For Multiple File Uploading
            for (let i = 0; i < images.length; i++) {
                mul_newpath[i] = './public\\images\\HomeBanner\\' + images[i].name;
                console.log(mul_newpath[i]);
                images[i].mv(mul_newpath[i], function (err) {

                    let image_name = images[i].name;
                    let imagedata = new HomeBanner({
                        BannerName: image_name,
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
            res.redirect("/Admin/AdminHomeBanner");
        } else {
            res.send("Please Select 2 or More than 2 Files To Upload Multiple Files");
        }
    }
    else {
        res.redirect('/Admin');
    }

});


//HomeBanner Delete data
router.post('/AdminHomeBannerDelete', (req, res) => {
    if (req.session.EmailId) {
        let cid = req.body.cid;
        console.log(cid);
        HomeBanner.remove({_id: cid}, function (err) {
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


//HomeBanner Delete All data
router.post('/AdminHomeBannerDeleteAll', (req, res) => {
    if (req.session.EmailId) {
        HomeBanner.remove( function (err) {
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
