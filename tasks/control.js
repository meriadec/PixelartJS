'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var jscsStylish = require('gulp-jscs-stylish');
var fs = require('fs');

module.exports = function (done) {

  var conf = JSON.parse(fs.readFileSync('.jshintrc', 'utf-8'));
  var paths = [
    'src/*.js',
    'test/*.spec.js',
    'gulpfile.js',
    'tasks/*.js'
  ];

  gulp.src(paths)
    .pipe(jshint(conf))
    .pipe(jshint.reporter('jshint-stylish'))
    .on('finish', function () {
      gulp.src(paths)
        .pipe(jscs())
        .on('error', function () {})
        .pipe(jscsStylish())
        .on('end', done);
    });
};
