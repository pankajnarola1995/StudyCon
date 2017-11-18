var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/ajaxcall', function (req,res) {
    var data={
    contactId: 1,
    firstName:'a',
      lastName:'narola',
      email:'p@gmail.com',


  };
  res.send(data);
    
});
router.get('/ajaxcallClear', function (req,res) {
    var data1={
        contactId: '1',
        firstName:'2',
        lastName:'3',
        email:'4',


    };
    res.send(data1);

});
module.exports = router;
