var request = require('superagent');
var express = require('express');
var flash = require('connect-flash');
var router = express.Router();
var mailchimp = require('mailchimp');

//let Newssignup = require('../modals/user');
var mailchimpInstance   = 'us16',
    listUniqueId        = 'c930964415',
    mailchimpApiKey     = '2c3ee5bf21017ea429e65c592f84aa76-us16';

router.get('/', function(req, res){
      res.render('index', {
        title:'UVC Tech'
  });
});
// Load resume page
router.get('/aboutuvc',function(req, res){
    res.render('aboutuvc', {
      title:'About UVC Tech'
  });
});
// design Route
router.get('/contactuvc', function(req, res){
     res.render('contactuvc', {
       title:'Contact UVC Tech'
  });
});
// art Route
router.get('/video', function(req, res){
      res.render('video', {
        title:'Video UVC Tech'
  });
});

// art Route
router.get('/teaminfo', function(req, res){
      res.render('teaminfo', {
        title:'Team'
  });
});

// art Route
router.get('/signup', function(req, res){
//  Newssignup.find(), function(err, newsletteruvc)
//   res.render('moreinfo', {
//   title:'Under Development'
//  })
    req.flash('success','Signed Up!');
    req.flash('error','Error Signing Up!');
});

router.post('/signup',function(req,res){
    request
       .post('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + listUniqueId + '/members/')
       .set('Content-Type', 'application/json;charset=utf-8')
       .set('Authorization', 'Basic ' + new Buffer('any:' + mailchimpApiKey ).toString('base64'))
       .send({
         'email_address': req.body.email,
         'status': 'subscribed',
         'merge_fields': {
           'FNAME': req.body.firstName,
           'LNAME': req.body.lastName
         }
       })
           .end(function(err, response) {
             if (response.status < 300 || (response.status === 400 && response.body.title === "Member Exists")) {
               res.render('index');
                } else {
                  res.render('index');
            }
         });
});

module.exports = router;
