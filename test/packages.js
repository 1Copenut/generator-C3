'use strict';
var path = require('path');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');

describe('package JSON', function() {
  before(function(done) {
    helpers.run(path.join(__dirname, '../app'))
      .withPrompts({features: []})
      .on('end', done);
  });

  it('should contain all development modules', function() {
    [
      'autoprefixer',
      'axe-core',
      'babel-preset-es2015',
      'babelify',
      'beepbeep',
      'benv',
      'browser-sync',
      'browserify',
      'browserify-istanbul',
      'browserify-shim',
      'chai',
      'clean',
      'coffee-script',
      'critical',
      'del',
      'event-stream',
      'express',
      'fs',
      'fsevents',
      'gulp',
      'gulp-cached',
      'gulp-cssnano',
      'gulp-eslint',
      'gulp-express',
      'gulp-filter',
      'gulp-htmlbuild',
      'gulp-load-plugins',
      'gulp-nodemon',
      'gulp-notify',
      'gulp-nunjucks-render',
      'gulp-phantomcss',
      'gulp-plumber',
      'gulp-postcss',
      'gulp-rename',
      'gulp-sass',
      'gulp-scss-lint',
      'gulp-shell',
      'gulp-sourcemaps',
      'gulp-uglify',
      'gulp-util',
      'gulp-watch',
      'gulp-yuidoc',
      'is-path-cwd',
      'istanbul',
      'jade',
      'karma',
      'karma-browserify',
      'karma-chrome-launcher',
      'karma-coverage',
      'karma-firefox-launcher',
      'karma-fixture',
      'karma-html2js-preprocessor',
      'karma-json-fixtures-preprocessor',
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-phantomjs-launcher',
      'minimist',
      'mocha',
      'nodemon',
      'path',
      'phantomjs',
      'postcss',
      'postcss-colorblind',
      'pre-commit',
      'run-sequence',
      'stylefmt',
      'vinyl-buffer',
      'vinyl-paths',
      'vinyl-source-stream',
      'vinyl-transform'
    ].forEach(function(devMod) {
      assert.fileContent('package.json', devMod);
    });
  });

  it('should contain all production modules', function() {
    [
      'hexa-color-regex',
      'jquery'
    ].forEach(function(prodMod) {
      assert.fileContent('package.json', prodMod);
    });
  });

  it('should contain all npm run scripts', function() {
    [
      'karma start karma.conf.js',
      'gulp js:lint',
      'NODE_ENV=test karma start karma.conf.js --single-run --browsers Chrome,Firefox,Safari'
    ].forEach(function(testScripts) {
      assert.fileContent('package.json', testScripts);
    });
  });

  it('should contain pre-commit hooks', function() {
    [
      'js-lint',
      'full-test'
    ].forEach(function(precommits) {
      assert.fileContent('package.json', precommits);
    });
  });
});

