var request = require('superagent');
var express = require('express');
var flash = require('connect-flash');
var router = express.Router();
var mailchimp = require('mailchimp');
var nodemailer = require('nodemailer');

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
       title:'Contact Us'
  });
});
// product Route
router.get('/products', function(req, res){
     res.render('products', {
       title:'UVC Tech Products'
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

//contact form
router.post('/send',(req,res) =>{
    const output =`
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
      <li>Name: ${req.body.name}</li>
      <li>Company: ${req.body.company}</li>
      <li>Email: ${req.body.email}</li>
      <li>Subject: ${req.body.subject}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>`;

      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
          host: 'parc.web-dns1.com',
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
              user: 'contact@uvctech.ca', // generated ethereal user
              pass: 'Q,0]wUrVsMp567'// generated ethereal password
          },

          tls:{
            rejectUnauthorized:false
          }
      });

      // setup email data with unicode symbols
      let mailOptions = {
          from: '"Contact UVC" <contact@uvctech.ca>', // sender address
          to: 'contact@uvctech.ca', // list of receivers
          subject: 'Contact UVC Form', // Subject line
          text: output, // plain text body
          html: output // html body
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message sent: %s', info.messageId);
          // Preview only available when sending through an Ethereal account
          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

          res.render('contactuvc',{msg:'Email has been sent'});

          // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
          // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      });

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
