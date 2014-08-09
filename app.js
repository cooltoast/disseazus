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
  var name = diseaseForm['name'];
  var description = diseaseForm['description'];
  var source = diseaseForm['source'];
  var notes = diseaseForm['notes'];

  console.log('name: ' + name);
  console.log('description: ' + description);
  console.log('source: ' + source);
  console.log('notes: ' + notes);

  var checkSubmit = function() {
    if (name == '' || description == '' || source == '' || notes == '') {
      return false;
    }
    return true;
  }

  if (checkSubmit()) {
    try {
      var diseaseEntry = {};
      diseaseEntry['name'] = name;
      diseaseEntry['description'] = description;
      diseaseEntry['source'] = source;
      diseaseEntry['notes'] = notes;
      diseaseEntryStr = JSON.stringify(diseaseEntry);

      var stmt = db.prepare("INSERT INTO diseases_table VALUES (?)");
      stmt.run(diseaseEntryStr);
      stmt.finalize();
    } catch(err) {
      console.log('well shit there\'s an error');
      console.log(err);
    }
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
