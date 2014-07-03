var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('diseases.db');

db.serialize(function() {
  db.run('CREATE TABLE diseases_table(disease TEXT)');
});
