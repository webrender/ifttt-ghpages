// server.js
// where your node app starts

// init project
var express = require('express');
var bodyParser = require('body-parser');
var rp = require('request-promise');
var Bluebird = require('bluebird');
var moment = require('moment');
var getColors = require('get-image-colors');
var chrono = require('chrono-node');
var app = express();
var GitHubApi = require('github');

var github = new GitHubApi();

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.post("/", (req, res) => {
  var date = new Date();;
  var post = '---\n';
  Object.keys(req.body[0]).forEach(key => {
    if (key === 'date') {
      date = chrono.parseDate(req.body[0].date);
      post += `date: ${date.toISOString()}\n`;
    } else {
      post += `${key}: ${req.body[0][key]}\n`;
    }
  })
  post += '---\n';
  post += decodeURIComponent(req.body[1]);
  console.log(post);
  github.authenticate({
    type: 'oauth',
    token: process.env.GH_TOKEN
  })
  github.repos.createFile({
    owner: process.env.GH_USER,
    repo: process.env.GH_REPO,
    path: `_posts/${moment(date).format('YYYY-MM-DD-HH-mm-ss-')}.html`,
    message: 'post via ifttt-jekyll',
    content: new Buffer(post).toString('base64')
  }, function(err, res) {
    if (err)
      console.log('error: ' + err);
    else
      console.log('success: ' + res);
  })
  res.sendStatus(200);
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});