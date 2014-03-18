# Intro

Scrape twitter profiles for basic, publicly available bio information.

## Installation

First, install [CasperJS](http://www.casperjs.org).

	brew install https://raw.github.com/mxcl/homebrew/8f7a1311af77b13b2bd5cc0d760290a320024525/Library/Formula/casperjs.rb

(This will install a version that works correctly. The default
version in [Homebrew](http://brew.sh/) has some issues with
the current version of [http://phantomjs.org/](http://phantomjs.org/).

## Running it

	casperjs twitter-scraper.js input.csv output.csv

That will open a file `input.csv`, which should contain a comma-separated
list of twitter handles (with or without the `@` symbol) and save the profile
data to a file named `output.csv`.

## Example input.csv

An exaple input file would contain:

	gcallsen, datakyle, voozahq