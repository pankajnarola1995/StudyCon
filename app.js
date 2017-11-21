var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var assert = require('assert');

//mongodb url and required
//var url = 'mongodb://localhost:27017/StudyConDb';
const mongoose= require('mongoose');
var dbConn = mongoose.connect('mongodb://localhost/StudyConDb', {
    useMongoClient: true,
    /* other options */
});
if (dbConn){
    console.log('Database connection success');
} else {
    console.log('Database connection fail');
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



var contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message:String

});
var contact = mongoose.model('contact',contactSchema);

app.post('/save_contact', function (req,res) {
    var contactinfo = new contact({
        name: req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message

    });

    contactinfo.save(function (err, thro) {
        if (err) {
            return console.error(err);
        }
        else {
            console.log("1 record inserted");


            //alert("Your data sent successfully! We will get back to you soon... ");
            res.redirect('/');
        }
    });
});


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


});


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
