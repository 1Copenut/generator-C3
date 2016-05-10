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
        this.destinationPath('app/favicon.ico')
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
        this.destinationPath('app/robots.txt')
      );

      this.fs.copy(
        this.templatePath('phantomas.json'),
        this.destinationPath('phantomas.json')
      );
      
      this.fs.copy(
        this.templatePath('yslow.js'),
        this.destinationPath('yslow.js')
      );
      
      // Copy the config and env files
      this.directory('config', 'config');

      // Copy the Gulp tasks
      this.directory('tasks', 'tasks');

      // Copy the /app folder files
      this.fs.copy(
        this.templatePath('apple-touch-icon-57x57-precomposed.png'),
        this.destinationPath('app/apple-touch-icon-57x57-precomposed.png')
      );
      
      this.fs.copy(
        this.templatePath('apple-touch-icon-72x72-precomposed.png'),
        this.destinationPath('app/apple-touch-icon-72x72-precomposed.png')
      );
      
      this.fs.copy(
        this.templatePath('apple-touch-icon-114x114-precomposed.png'),
        this.destinationPath('app/apple-touch-icon-114x114-precomposed.png')
      );
      
      this.fs.copy(
        this.templatePath('apple-touch-icon-144x144-precomposed.png'),
        this.destinationPath('app/apple-touch-icon-144x144-precomposed.png')
      );
      
      this.fs.copy(
        this.templatePath('apple-touch-icon-precomposed.png'),
        this.destinationPath('app/apple-touch-icon-precomposed.png')
      );
      
      this.fs.copy(
        this.templatePath('apple-touch-icon.png'),
        this.destinationPath('app/apple-touch-icon.png')
      );
      
      // Copy the Sass files and libs
      this.directory('sass', 'app/styles/sass');

      // Copy the Javascript (not libs)
      this.directory('jsSrc', 'app/scripts/src');
      
      // Copy the Nunjucks template files
      this.directory('pages', 'app/pages');
      this.directory('templates', 'app/templates');

      // Copy the test index.html and files
      this.fs.copy(
        this.templatePath('test_index.html'),
        this.destinationPath('test/index.html')
      );

      this.directory('testScripts', 'test/scripts');
      this.directory('testFixtures', 'test/fixtures');

      // Copy the server files
      this.fs.copy(
        this.templatePath('server.js'),
        this.destinationPath('server/server.js')
      );
    }
  },

  install: function() {
    this.installDependencies();
  }
});
