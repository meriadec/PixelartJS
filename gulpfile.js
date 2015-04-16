'use strict';

var gulp = require('gulp');

gulp.task('default', ['control', 'test', 'build']);

gulp.task('build', require('./tasks/build'));
gulp.task('test', require('./tasks/test').single);
gulp.task('watch', require('./tasks/test').watch);
gulp.task('control', require('./tasks/control'));
gulp.task('cover', require('./tasks/cover'));
