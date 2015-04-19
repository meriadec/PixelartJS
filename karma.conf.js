'use strict';

module.exports = function (config) {
  config.set({
    basePath: '.',
    frameworks: ['jasmine'],
    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-coverage'
    ],
    preprocessors: {
      'src/*.js': 'coverage'
    },
    files: [
      'node_modules/jquery/dist/jquery.min.js',
      'src/*.js',
      'test/*.spec.js'
    ],
    exclude: [],
    reporters: ['progress', 'coverage'],
    coverageReporter: { type : 'lcov' },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['PhantomJS'],
    singleRun: true
  });
};
