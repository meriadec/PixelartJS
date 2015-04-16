'use strict';

var karma = require('karma').server;
var configFile = __dirname + '/../karma.conf.js';

module.exports = {
  single: function (done) {
    karma.start({
      configFile: configFile
    }, function () { done(); });
  },
  watch: function (done) {
    karma.start({
      configFile: configFile,
      autoWatch: true,
      singleRun: false
    }, function () { done(); });
  }
};
