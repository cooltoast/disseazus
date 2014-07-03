var express = require("express");
var ejs = require("ejs");
var pg = require('pg');
var app = express();

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('diseases.db');

///////////////////////////////////////////////////////////////////////////////
// APP CONFIGURATION                                                         //
///////////////////////////////////////////////////////////////////////////////
//configure logging
app.use(express.logger());
//make files in static folder publicly accessible
app.use('/static', express.static(__dirname + '/static'));
//use ejs for html templates
app.engine('html', ejs.renderFile);

///////////////////////////////////////////////////////////////////////////////
// APP ROUTES                                                                //
///////////////////////////////////////////////////////////////////////////////
//default route
app.get('/', function(req, res) {
  res.render('index.html', { });
});

app.get('/submit_disease', function(req, res) {
  var diseaseForm = req.query;
  var firstName = diseaseForm['firstname'];
  var lastName = diseaseForm['lastname'];
  var sex = diseaseForm['sex'];

  console.log('first name: ' + firstName);
  console.log('last name: ' + lastName);
  console.log('sex: ' + sex);

  var checkSubmit = function() {
    if (firstName == '' || lastName == '' || !(sex == 'male' || sex == 'female')) {
      return false;
    }
    return true;
  }

  if (checkSubmit()) {
    var disease_info = firstName + ' ' + lastName + ' ' + sex; 
    db.run('INSERT INTO diseases_table VALUES ("' + disease_info + '")');
  } else {
    console.log('one or more fields were left empty');
  }
  res.redirect('/');
});

app.get('/display_diseases', function(req, res) {
  db.all('SELECT * FROM diseases_table', function(err, items) {
    res.render('diseases.html', {diseases: items});
  });
});

//////////////////////////////////////////////////////////////////////////////
// RUN CONFIGURATION                                                         //
///////////////////////////////////////////////////////////////////////////////
var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
    console.log("Listening on " + port);
});
