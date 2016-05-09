'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.Base.extend({
  // Ask for user input
  prompting: function() {
    var done = this.async();

    this.prompt({
      type: 'input',
      name: 'name',
      message: 'What would you like to name your project?',
      default: this.appname
    }, function(answers) {
      this.props = answers;
      this.log(answers.name);
      done();
    }.bind(this));
  },

  writing: {
    // Copy config files
    config: function() {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'), 
        { name: this.props.name }
      );
      
      this.fs.copyTpl(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json'), 
        { name: this.props.name }
      );
      
      this.fs.copy(
        this.templatePath('babelrc'),
        this.destinationPath('.babelrc')
      );

      this.fs.copy(
        this.templatePath('bowerrc'),
        this.destinationPath('.bowerrc')
      );

      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );

      this.fs.copy(
        this.templatePath('eslintrc'),
        this.destinationPath('.eslintrc')
      );

      this.fs.copy(
        this.templatePath('favicon.ico'),
        this.destinationPath('favicon.ico')
      );

      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore')
      );

      this.fs.copy(
        this.templatePath('Gulpfile.js'),
        this.destinationPath('Gulpfile.js')
      );

      this.fs.copy(
        this.templatePath('karma.conf.js'),
        this.destinationPath('karma.conf.js')
      );

      this.fs.copy(
        this.templatePath('nodemon.json'),
        this.destinationPath('nodemon.json')
      );

      this.fs.copy(
        this.templatePath('README.md'),
        this.destinationPath('README.md')
      );

      this.fs.copy(
        this.templatePath('robots.txt'),
        this.destinationPath('robots.txt')
      );

      this.fs.copy(
        this.templatePath('phantomas.json'),
        this.destinationPath('phantomas.json')
      );

      this.fs.copy(
        this.templatePath('yslow.js'),
        this.destinationPath('yslow.js')
      );
    }
  }
});
