
let express = require('express');
let app = express();
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let assert = require('assert');
let fileUpload = require('express-fileupload');

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
app.use(express.static(path.join(__dirname, 'model')));

//redirection of file to the particular pages
app.use('/', require('./routes/index'));
app.use('/demo', require('./routes/demo'));
app.use('/users', require('./routes/users'));
app.use('/home', require('./routes/home'));
app.use('/contact', require('./routes/contact'));
app.use('/websocket', require('./routes/websocket'));
app.use('/signin', require('./routes/signin'));
app.use('/register', require('./routes/register'));

app.use('/Admin', require('./routes/Admin/AdminIndex'));
app.use('/Admin/AdminContactView', require('./routes/Admin/AdminContactView'));
app.use('/Admin/AdminConsultancy', require('./routes/Admin/AdminConsultancy'));
app.use('/Admin/AdminLanguage', require('./routes/Admin/AdminLanguage'));
app.use('/Admin/AdminAddEvent', require('./routes/Admin/AdminAddEvent'));

app.use(fileUpload());

//contact table create


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


app.get('/ajaxcall',  (req, res) => {
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

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;