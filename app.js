var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const mongoose= require('mongoose');
var assert = require('assert');

//database connection
var dbConn = mongoose.connect('mongodb://localhost/StudyConDb', {
    useMongoClient: true,
    /* other options */
});
if(dbConn) {
    console.log('success');
}else {
    console.log('fail');
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//redirection of file to the particular pages
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/home', require('./routes/home'));
app.use('/contact', require('./routes/contact'));

app.use('/Admin', require('./routes/Admin/AdminIndex'));
app.use('/Admin/AdminContactView', require('./routes/Admin/AdminContactView'));
app.use('/websocket', require('./routes/websocket'));

//contact table create
var contactSchema =  mongoose.Schema({

    Name: String,
    Subject: String,
    Email: String,
    Message: String

});
var contact = mongoose.model("contact",contactSchema);

//contact method call
app.post('/saveContact', function (req,res) {
    console.log("postcontact");
    var contactdata = new contact( {
        Name: req.body.name,
        Subject: req.body.subject,
        Email:req.body.email,
        Message:req.body.message
    });
        contactdata.save(function(error, data){
            if(error){
                console.log("contact insert error ");
                res.json(error);

            }
            else{
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


app.get('/ajaxcall', function (req,res) {
    contact.find(function (err,data) {
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
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
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