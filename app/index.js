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
};

// Copy SCSS
C3Generator.prototype.styles = function styles() {
  this.copy('main.scss', 'app/styles/sass/main.scss');
  this.directory('core', 'app/styles/sass');
  this.directory('bourbon', 'app/styles/sass/lib');
  this.directory('neat', 'app/styles/sass/lib');
};

// Copy Javascript
C3Generator.prototype.scripts = function scripts() {
  this.copy('main.js', 'app/scripts/src/main.js');
  this.directory('modernizr', 'app/lib');
  this.directory('video-js', 'app/lib');
  this.directory('a11y', 'app/scripts/src');
  this.directory('lib', 'app/scripts/src');
  this.directory('utilities', 'app/scripts/src');
};

// Copy nunjucks templates
C3Generator.prototype.tmpl = function tmpl() {
  this.copy('layout.nunjucks', 'app/templates/layout.nunjucks');
  this.directory('pages', 'app');
  this.directory('macros', 'app/templates');
  this.directory('partials', 'app/templates');
};

// Make the directories
C3Generator.prototype.app = function app() {
  this.mkdir('app');
  this.mkdir('app/styles');
  this.mkdir('app/styles/css');
  this.mkdir('app/styles/sass');
  this.mkdir('app/lib');
  this.mkdir('app/scripts');
  this.mkdir('app/scripts/src');
  this.mkdir('app/scripts/out');
  this.mkdir('app/templates');
};

C3Generator.prototype.server = function server() {
  this.mkdir('server');
  this.copy('server.js', 'server/server.js');
};

