var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const mongoose= require('mongoose');
var assert = require('assert');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//database connection
var dbConn = mongoose.connect('mongodb://localhost/myapp', {
    useMongoClient: true,
    /* other options */
});
if(dbConn) {
    console.log('success');
}else {
    console.log('fail');
}



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
app.use('/websocket', require('./routes/websocket'));
var url = 'mongodb://localhost:27017/StudyConDb';

app.post('/post-contact', function (req,res) {

//console.log("postcontact");
    var item = {
        name: req.body.name,
        age: req.body.age
    };
    mongoose.connect(url, function (err,db) {
        //useMongoClient: true,
        assert.equal(null,err);
        db.collection('contact').insertOne(item, function (err,result) {
            assert.equal(null,error);
            console.log('data insrrtes');
            db.close();

        });

    });
    res.send('/insert');

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