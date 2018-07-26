const express = require('express');
const data = require('./data.json');

const app = express();
app.use('/', function(req, res){ 
  res.send(data);
});

// Start your app.
app.listen(3001);
