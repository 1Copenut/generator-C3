'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var C3Generator = module.exports = function C3Generator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(C3Generator, yeoman.generators.Base);

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
};

// Copy SCSS
C3Generator.prototype.styles = function styles() {
  this.directory('sass', 'app/styles/sass');
};

// Copy Javascript
C3Generator.prototype.scripts = function scripts() {
  this.directory('lib', 'app/lib');
  this.directory('src', 'app/scripts');
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
  this.mkdir('app');
  this.mkdir('app/pages');
  this.mkdir('app/styles');
  this.mkdir('app/styles/css');
  this.mkdir('app/scripts');
  this.mkdir('app/scripts/out');
  this.mkdir('app/templates');
};

C3Generator.prototype.server = function server() {
  this.mkdir('server');
  this.copy('server.js', 'server/server.js');
};

