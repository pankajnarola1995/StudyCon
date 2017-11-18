var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const mongoose= require('mongoose');


var index = require('./routes/index');
var users = require('./routes/users');
var home = require('./routes/home');
var contact = require('./routes/contact');



//var db = mongoose.connection;
//db.on('error', console.error);
/* mongoose.connect('mongodb://localhost/jyoti');
mongoose.connection.once('open',function() {
    console.log('connetion success');
}).on('error',function(error){
  console.log('conn error',error);
}); */
var dbConn = mongoose.connect('mongodb://localhost/myapp', {
    useMongoClient: true,
    /* other options */

});
if(dbConn) {
    console.log('success');
}else {
  console.log('fail');
}
/*
var user = mongoose.model('emp',schema);

var schema= new mongoose.Schema({
  age:'number'
});

*/

app.use(bodyParser.urlencoded({extended:false}));

var user = mongoose.model(contact);
app.post('/post-contact', function (req,res) {
  new user({
      name : req.body.name,
      add  : req.body.add
  }).save(function (err,doc) {
      if(err) res.json(err);
      else res.send('succes insert');

    })

});
/*app.post('/post-contact', function (req,res) {
  //req.end("stop");
    var dbConn = mongoose.connect('mongodb://localhost/myapp', {
        useMongoClient: true,
        /* other options

    });
        delete req.body._id; // for safety reasons
        dbConn.collection('contact').insertOne(req.body);



   res.send(('inserted:\n' +  JSON.stringify(req,bodyParser)));
});*/
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/home', home);
app.use('/contact', contact);

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
