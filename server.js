// server.js
// where your node app starts

// init project
var express = require('express');
var bodyParser = require('body-parser');
var moment = require('moment');
var chrono = require('chrono-node');
var app = express();
var GitHubApi = require('github');
var moment = require('moment');

var github = new GitHubApi();

app.use(bodyParser.text());
app.post("/", (req, res) => {
  if (req.query.token !== process.env.WEBHOOK_TOKEN)
    res.sendStatus(400);
  var body = req.body.replace(/\|\|\|/g, '\n');
  body = body.replace('INSERT_DATE_HERE', moment(new Date()).subtract(10, 'hours').format("MMMM D, YYYY [at] HH:mmA"));
  console.log(body)
  if (body.includes('post via ifttt-ghpages')) { 
    // don't post commits from this script, causing an infinite post loop
    res.sendStatus(200)
  } else {
    var title;
    var titleSearch = body.match(/title: (.*?)\n/);
    if (titleSearch && titleSearch.length > 0) {
      title = titleSearch[1];
    }
    var dateSearch = body.match(/date: (.*?)\n/);
    var date = dateSearch[1] ? chrono.parseDate(dateSearch[1]) : new Date();
    github.authenticate({
      type: 'oauth',
      token: process.env.GH_TOKEN
    })
    github.repos.createFile({
      owner: process.env.GH_USER,
      repo: process.env.GH_REPO,
      path: `_posts/${moment(date).format('YYYY-MM-DD-HH-mm-ss-')}${title}.html`,
      message: 'post via ifttt-ghpages',
      content: new Buffer(body).toString('base64')
    }, function(err, resp) {
      if (err) {
        console.log('error: ' + err);
        res.sendStatus(500);
      } else {
        console.log('success: ' + resp);
        res.sendStatus(200);
      }
    });
  }
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});