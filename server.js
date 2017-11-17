// server.js
// where your node app starts

// init project
var express = require('express');
var bodyParser = require('body-parser');
var moment = require('moment');
var chrono = require('chrono-node');
var app = express();
var GitHubApi = require('github');

var github = new GitHubApi();

app.use(bodyParser.json());

app.post("/", (req, res) => {
  if (req.body[0] !== process.env.WEBHOOK_TOKEN)
    res.sendStatus(400);
  var date = new Date();;
  var post = '---\n';
  Object.keys(req.body[1]).forEach(key => {
    if (key === 'date') {
      date = chrono.parseDate(req.body[1].date);
      post += `date: ${date.toISOString()}\n`;
    } else {
      post += `${key}: ${req.body[1][key]}\n`;
    }
  })
  post += '---\n';
  post += decodeURIComponent(req.body[2]);
  console.log(post);
  github.authenticate({
    type: 'oauth',
    token: process.env.GH_TOKEN
  })
  github.repos.createFile({
    owner: process.env.GH_USER,
    repo: process.env.GH_REPO,
    path: `_posts/${moment(date).format('YYYY-MM-DD-HH-mm-ss-')}${req.body[1].title}.html`,
    message: 'post via ifttt-ghpages',
    content: new Buffer(post).toString('base64')
  }, function(err, resp) {
    if (err) {
      console.log('error: ' + err);
      res.sendStatus(500);
    } else {
      console.log('success: ' + resp);
      res.sendStatus(200);
    }
  });
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});