var request = require('superagent');
var express = require('express');
var expressHbs = require('express-handlebars');
//var mongoose = require('mongoose');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var routes = require('./routes/index'); //setting route
var path = require('path'); //for connecting folders
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
var app = express();

//mongoose.Promise = global.Promise;

//mongoose.connect('mongodb://localhost/uvctech');
//let db = mongoose.connection;


//using handlebars
app.engine('hbs', expressHbs({extname: 'hbs',defaultLayout: 'layout'}));
app.set('view engine', 'hbs');
//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
  secret:'mysupersecret',
  resave:true,
  saveUninitialized: true,
}));
app.use(flash());
//set public folder
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'views')));

//set routes folder
app.use('/', routes);

app.listen(2000,function(req,res){
  console.log('Server is running');
});
