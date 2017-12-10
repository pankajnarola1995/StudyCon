let express = require('express');
let app = express();
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
const mongoose = require('mongoose');
let Schema = mongoose.Schema;
let assert = require('assert');
const fileUpload = require('express-fileupload');

//database connection
let dbConn = mongoose.connect('mongodb://localhost/StudyConDb', {
    useMongoClient: true,
    /* other options */
});
if (dbConn) {
    console.log('success');
} else {
    console.log('fail');
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//redirection of file to the particular pages
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/home', require('./routes/home'));
app.use('/contact', require('./routes/contact'));
app.use('/websocket', require('./routes/websocket'));
app.use('/signin', require('./routes/signin'));
app.use('/register', require('./routes/register'));

app.use('/Admin', require('./routes/Admin/AdminIndex'));
app.use('/Admin/AdminContactView', require('./routes/Admin/AdminContactView'));
app.use('/AdminConsultancy', require('./routes/Admin/AdminConsultancy'));
app.use('/AdminConsultancyAdddata', require('./routes/Admin/AdminConsultancy'));
app.use('/Admin/AdminLanguage', require('./routes/Admin/AdminLanguage'));
app.use('/AdminAddEvent', require('./routes/Admin/AdminAddEvent'));

app.use(fileUpload());

//contact table create
let contactSchema = mongoose.Schema({

    Name: String,
    Subject: String,
    Email: String,
    Message: String

});
//Consultancy Table Create
let ConsultancySchema = mongoose.Schema({
    _id: Schema.Types.ObjectId,
    country_name: String,
    flage_image: String,
    requirenment: String,
    detail: String,
    important_link: String

});
//Image Table Create
let ImageSchema = mongoose.Schema({
    //author: { type: Schema.Types.ObjectId, ref: 'Person' },
    consultancy_id: {type: Schema.Types.ObjectId, ref: 'Consultancy'},
    images_name: String,

});
let Image = mongoose.model("Image", ImageSchema);
let Consultancy = mongoose.model("Consultancy", ConsultancySchema);
let contact = mongoose.model("contact", contactSchema);

//contact method call
app.post('/saveContact', function (req, res) {
    console.log("postcontact");
    let contactdata = new contact({
        Name: req.body.name,
        Subject: req.body.subject,
        Email: req.body.email,
        Message: req.body.message
    });
    contactdata.save(function (error, data) {
        if (error) {
            console.log("contact insert error ");
            res.json(error);

        }
        else {
            console.log("contact inserted ");
            res.redirect("/");
        }
    });
});


/*
//Admin Functions
app.get('/AdminContactView',function (req,res) {

    contact.find(function (err,data) {
        if(data){
            console.log("Contact Data Fetched");
            res.render('Admin/AdminContactView',{contact:data});
        }
        else
        {
            res.status(400).send(err);
        }
        
    });
    console.log('AdminContactView');


});*/

//Consultancy Insert data
/*
app.post('/AdminConsultancyAddData', function (req, res) {

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
app.post('/AdminConsultancyAddData', function (req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

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
        _id: new mongoose.Types.ObjectId(),
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
            imagedata.save(function (error, data) {
                if (error) {
                    console.log("image insert error ");
                    res.json(error);

                }
                else {
                    console.log("Multiple image inserted " + [i]);
                }
            });
        });
    };
    console.log("Everything Done");
    res.redirect("/AdminConsultancy");


});

//Consultancy Delete data
app.post('/AdminConsultancyDeleteData', function (req, res) {

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
    //Consultancy.findByIdAndRemove(cid).then((docs) => {});

    //Consultancy.delete(function(err,Consultancy){
    // if(err) throw err;
    // console.log('the document is deleted');
    //res.send(question);

    //});


});

//Consultancy Update data
app.post('/AdminConsultancyUpdateGetData', function (req, res) {
    console.log("Ajax working");


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
});


//Consultancy Update data
app.post('/AdminConsultancyUpdateData', function (req, res) {
    console.log("AdminConsultancyAddData");


    let country_name = req.body.country_name;
    let flage_image = req.body.flage_image;
    let requirenment = req.body.requirenment;
    let detail = req.body.detail;
    let important_link = req.body.important_link;
    //   images:         req.body.images

    // console.log(consultancyData);
    let promise = Consultancy.update({'country_name': country_name},
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

    if (promise) {
        console.log("updated Consultancy data");
        res.redirect("/AdminConsultancy");
    }
    else {
        console.log("error in updated Consultancy");
        res.redirect("/AdminConsultancy");
    }
});


let AddEventSchema = mongoose.Schema({

    event_name: String,
    event_description: String,
    event_type: String,
    event_details: String,
    images: String,
    // images:String

});

//Admin Event handling

let AddEvent = mongoose.model("AddEvent", ConsultancySchema);


app.post('/AdminAddEventAddData', function (req, res) {
    console.log("AdminAddEventAddData");

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
        res.redirect("/AdminAddEvent");
    }
    else {
        console.log("error in insert event");
        res.redirect("/AdminAddEvent");

    }


});


app.get('/ajaxcall', function (req, res) {
    contact.find(function (err, data) {
        if (data) {
            console.log("Contact Data Fetched");
            res.send(data);
            //res.render('Admin/AdminContactView',{contact:data});
        }
        else {
            res.status(400).send(err);
        }
    });
    console.log("Ajax working");
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    //database connection
    //mongoose.connect('mongodb:http://localhost:27017/mongo');

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;