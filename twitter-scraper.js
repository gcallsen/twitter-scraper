'use strict'
var fs = require('fs');
var utils = require('utils');
var system = require('system');

var casper = require("casper").create({
  // Uncomment the following when debugging
  // logLevel: 'debug',
  waitTimeout: 15000,
  stepTimeout: 15000,
  verbose: true,
  viewportSize: {
    width: 1400,
    height: 768
  }
});

// variable declaration
var input_file, output_file, twitter_handles, profile_data;
var output_data = 'Name, Profile Picture, Bio, Website, Location, Tweets, Following, Followers' + '\n';

// Make sure we can accept usernames with or without @ symbol
function cleanHandles(list_of_handles) {
  var clean_list = [];
  for (var i=0;i<list_of_handles.length;i++) {
    clean_list.push(list_of_handles[i].replace(/@|^[ \t]+|[ \t]+$|[ \t\r\n]/,''));
  }
  return clean_list;
}

// Get our input and output filenames from command line
function getFiles() {
  input_file = casper.cli.get(0);
  output_file = casper.cli.get(1);
  twitter_handles = fs.read(input_file).split(',');
  twitter_handles = cleanHandles(twitter_handles);
}

// Grabs essential profile info
function extractProfileData(){
  var el = casper.evaluate(function() {

    // Put in quotes so commas don't mess up csv
    // Also escape any quotes that may exist in the contents
    function quoteAndCleanContents(contents) {
      return "\"" + contents.replace(/"/g,'\\"') + "\"";
    }

    var user_data = [];
    var user_name = document.title
    user_data.push(quoteAndCleanContents(user_name.replace(' on Twitter', '')));

    // User bio
    user_data.push(quoteAndCleanContents($('div.profile-header-inner > a.profile-picture').data('resolved-url-large')));
    user_data.push(quoteAndCleanContents($('div.bio-container > p.profile-field').text()));
    user_data.push(quoteAndCleanContents($.trim($('p.location-and-url > span.url > span.profile-field > a').text())));
    user_data.push(quoteAndCleanContents($.trim($('p.location-and-url > span.location-container > span.location').text())));

    // Basic user stats are in a ul in order of "tweets", "following", "followers"
    $('ul.stats').find('li').each(function() {
      user_data.push(quoteAndCleanContents($(this).find('strong').text()));
    });

    return user_data;
  });
  return el;
}

// Start casper up, a warm up lap going to twitter.com...
casper.start('http://www.twitter.com', function() {
  getFiles(); // Get our list of handles to search through
  this.echo("Beginning twitter scrape");
});

// Then cycle through all handles we want to search and extract relevant details
casper.then(function() {
  var i = 0;
  this.each(twitter_handles, function() {
    casper.thenOpen('http://www.twitter.com/' + twitter_handles[i], function() {
      profile_data = extractProfileData();
      this.echo(profile_data);
      output_data += profile_data + '\n';
    });
    i++;
  });
});

// Write our stuff to the output file designated
casper.then(function() {
  fs.write(output_file, output_data);
});

// Start-er up.
casper.run();