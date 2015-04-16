'use strict';

var exec = require('child_process').exec;

module.exports = function (done) {
  exec('cat ./coverage/**/lcov.info | ./node_modules/coveralls/bin/coveralls.js', done);
};
