'use strict';
var path = require('path');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');

describe('general', function () {
  before(function(done) {
    helpers.run(path.join(__dirname, '../app'))
      .on('error', function(err) {
        console.log('Hm, something went wrong.', err);
      })
      .withPrompts({ features: [] })
      .withGenerators([
        [helpers.createDummyGenerator(), 'mocha:app']
      ])
      .on('end', done);
  });

  it('the generator can be required without throwing', function() {
    // not testing the actual run of generators yet
    require('../app');
  });

  it('creates expected files', function() {
    assert.file([
      '.babelrc',
      '.eslintrc',
      '.gitignore',
      'bower.json',
      'Gulpfile.js',
      'karma.conf.js',
      'nodemon.json',
      'package.json',
      'phantomas.json',
      'yslow.js'
    ]);
  });
});
