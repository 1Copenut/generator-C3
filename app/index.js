'use strict';
var htmlWiring = require('html-wiring');
var mkdirp = require('mkdirp');
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var C3Generator = module.exports = function C3Generator(args, options, config) {
  yeoman.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(htmlWiring.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(C3Generator, yeoman.Base);

C3Generator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [{
    name: 'staticSite',
    message: 'What would you like to call your static site?',
  }];

  this.prompt(prompts, function (props) {
    this.statSite = props.staticSite;

    cb();
  }.bind(this));
};

// Copy the package.json file
C3Generator.prototype.packageJSON = function packageJSON() {
  this.template('_package.json', 'package.json');
}

// Copy the empty bower.json file
C3Generator.prototype.bowerJSON = function bowerJSON() {
  this.template('_bower.json', 'bower.json');
}

// Copy the Gulpfile
C3Generator.prototype.gulpfile = function gulpfile() {
  this.template('Gulpfile.js');
}

// Copy configuration files
C3Generator.prototype.projectfiles = function projectfiles() {
  this.copy('babelrc', '.babelrc');
  this.copy('editorconfig', '.editorconfig');
  this.copy('eslintrc', '.eslintrc');
  this.copy('gitignore', '.gitignore');
  this.copy('karma.conf.js', 'karma.conf.js');
  this.copy('nodemon.json', 'nodemon.json');
  this.copy('README.md', 'README.md');
  this.copy('phantomas.json', 'phantomas.json');
  this.copy('yslow.js', 'yslow.js');
  this.copy('robots.txt', 'app/robots.txt');
  this.copy('apple-touch-icon-57x57-precomposed.png', 'app/apple-touch-icon-57x57-precomposed.png');
  this.copy('apple-touch-icon-72x72-precomposed.png', 'app/apple-touch-icon-72x72-precomposed.png');
  this.copy('apple-touch-icon-114x114-precomposed.png', 'app/apple-touch-icon-114x114-precomposed.png');
  this.copy('apple-touch-icon-144x144-precomposed.png', 'app/apple-touch-icon-144x144-precomposed.png');
  this.copy('apple-touch-icon-precomposed.png', 'app/apple-touch-icon-precomposed.png');
  this.copy('apple-touch-icon.png', 'app/apple-touch-icon.png');
  this.copy('favicon.ico', 'app/favicon.ico');
  this.directory('config', 'config');
};

// Copy SCSS
C3Generator.prototype.styles = function styles() {
  this.directory('sass', 'app/styles/sass');
};

// Copy Javascript
C3Generator.prototype.scripts = function scripts() {
  this.directory('jsLib', 'app/lib');
  this.directory('jsSrc', 'app/scripts/src');
};

// Copy nunjucks templates
C3Generator.prototype.tmpl = function tmpl() {
  this.copy('index.nunjucks', 'app/pages/index.nunjucks');
  this.directory('templates', 'app/templates');
};

// Copy the Gulp tasks
C3Generator.prototype.tasks = function tasks() {
  this.directory('tasks', 'tasks');
};

// Make the directories
C3Generator.prototype.app = function app() {
  mkdirp('app');
  mkdirp('app/pages');
  mkdirp('app/styles');
  mkdirp('app/styles/css');
  mkdirp('app/scripts');
  mkdirp('app/scripts/out');
  mkdirp('app/templates');
};

// Make the test directories
C3Generator.prototype.test = function test() {
  mkdirp('test');
  this.copy('test_index.html', 'test/index.html');
  this.directory('testScripts', 'test/scripts');
  this.directory('testFixtures', 'test/fixtures');
};

// Make the server directory and copy server.js Express file
C3Generator.prototype.server = function server() {
  mkdirp('server');
  this.copy('server.js', 'server/server.js');
};

