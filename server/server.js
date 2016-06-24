var express = require('express'),
    app = express(),
    port = 8080,
    dotenv = require('dotenv').config(),
    twit = require('twit'),
		Nightmare = require('nightmare'),
		nightmare = Nightmare({ show: true });


app.use(express.static(__dirname + '/client'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/client/index.html');
});

app.listen(port, function() {
  console.log('Listening on port ' + port);
});

var Twit = require('twit');
 
var T = new Twit({
  consumer_key:         process.env.CONSUMER_KEY,
  consumer_secret:      process.env.CONSUMER_SECRET,
  access_token:         process.env.ACCESS_TOKEN,
  access_token_secret:  process.env.ACCESS_TOKEN_SECRET,
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests. 
});

var stream = T.stream('statuses/filter', { track: '#yogaday' });

var links = {
	mat1: " http://amzn.to/28QI2db",
	mat2: " http://amzn.to/28LUPgN",
	mat3: " http://amzn.to/28NG2Vr",
	mat4: " http://amzn.to/28OG937",
	mat5: " http://amzn.to/28OGzXe",
	mat6: " http://amzn.to/28MhV6U",
	mat7: " http://amzn.to/28O2Unu",
	mat8: " http://amzn.to/28MYCzc",
	mat9: " http://amzn.to/28O2NIy",
	mat10: " http://amzn.to/28MYY8Z",
	mat11: " http://amzn.to/28MYUGm",
	mat12: " http://amzn.to/28O34vf"
}
var keys = Object.keys(links);
var wait = false;

var part1 = ["in honor of #YogaDay,", "beacuse #YogaDay is the best day,", "since it's #YogaDay,", "thanks to #YogaDay,", "since everyone loves #YogaDay,", "in honor of Yoga Day,", "since today's Yoga Day,", "thanks to Yoga Day"];
var part2 = [" enjoy 40% off all Aviva mats!!", " all Aviva mats are 40% off.", " get 40% off any Aviva mat!", " take 40% off of any Aviva mat!", " Aviva is giving 40% discounts on mats!!", " all mats are 40% off!", " take 40% off mats!", " we're discounting mats by 40%!", " all mats are 40% off!", " save 40% on all mats!"];
var part4 = ["", "", "", " 👍🏼", " 🎉", " 🙏"];

function randInt(arr) {
	return Math.floor(Math.random() * arr.length)
}

function createTweet(){

	var num1 = randInt(part1);
	var num2 = randInt(part2);
	var num4 = randInt(keys);
	var num5 = randInt(part4)

	return part1[num1] + part2[num2] + part4[num5] + links[keys[num4]];

}

var user = process.env.TWIT_USERNAME;
var pass = process.env.TWIT_PASSWORD;

nightmare
 .goto("http://twitter.com/")
 .wait(3000)
 .click(".js-signout-button")
 .wait(2000)
 .goto("#signin-link .emphasize")
 .wait(500)
 .type("#signin-dropdown .signin-dialog-body .LoginForm .LoginForm-username .email-input", user)
 .wait(500)
 .type("#signin-dropdown .signin-dialog-body .LoginForm .LoginForm-password .text-input", pass)
 .wait(500)
 .then(function () {
   startStream();
 })
 .catch(function (error) {
   nightmare
   .goto("http://twitter.com/login")
   .wait(3000)
   .type(".js-username-field", user)
   .wait(500)
   .type(".js-password-field", pass)
   .wait(500)
   .click(".js-signin .submit")
   .wait(500)
   .then(function () {
			startStream();
   })
 });

function startStream(){
	console.log("HEY");
	stream.on('tweet', function (tweet) {
		var times = [60000, 50000, 40000, 70000, 80000];
	  if (!wait && tweet.retweeted_status === undefined) {
	  	wait = true;
	  	var num = randInt(times);
	  	setTimeout(function(){
	  	  	wait = false;
	  	 }, times[num]);
	  	// create tweet
	  	var id = tweet.id_str;
	  	var user = tweet.user.screen_name;
	  	var url = 'https://twitter.com/' + user + '/status/' + id;
	  	var replyid = "#tweet-box-reply-to-" + id;

	  	console.log(url)
	  	console.log(replyid)

	  	var tweet = createTweet();
	  	nightmares(url, replyid, tweet);
	  }
	})
}

function nightmares(url, replyid, tweet) {
	console.log(replyid);
	nightmare
	.goto(url)
	.wait(replyid)
	.wait(1000)
	.click(".permalink-tweet-container .tweet .stream-item-footer .js-actions .ProfileTweet-action--favorite .ProfileTweet-actionButton")
	.click(replyid)
	.insert(replyid, tweet)
	.click('div.inline-reply-tweetbox form.t1-form div.TweetBoxToolbar div.TweetBoxToolbar-tweetButton button.btn')
	.wait(1000)
	.then(function () {
    console.log("HEY")
  })
  .catch(function (error) {
    console.error('Search failed:', error);
  });
}

