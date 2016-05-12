'use strict';
var path = require('path');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');

describe('gulpfile', function() {
  before(function(done) {
    helpers.run(path.join(__dirname, '../app'))
      .withPrompts({features: []})
      .on('end', done);
  });

  it('should contain all Gulp tasks', function() {
    [
      'default',
      'colortest',
      'build',
      'colortest:protanomaly',
      'colortest:protanopia',
      'colortest:deuteranomaly',
      'colortest:deuteranopia',
      'colortest:tritanomaly',
      'colortest:tritanopia',
      'colortest:achromatomaly',
      'colortest:achromatopsia',
      'dist:remove',
      'dist:index',
      'dist:removeStyles',
      'dist:critical',
      'dist:copyScripts',
      'dist:uglifyScripts',
      'js',
      'js:build',
      'js:doc',
      'js:lint',
      'sass',
      'sass:lint',
      'sass:build',
      'server:nodemon',
      'server:browsersync',
      'nunjucks'
    ].forEach(function(task) {
      assert.fileContent('Gulpfile.js', 'gulp.task(\'' + task);
    });
  });
});

