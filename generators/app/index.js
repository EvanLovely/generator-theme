'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the kickass ' + chalk.red('Theme') + ' generator!'
    ));

    // var gruntconfig;

    var prompts = [
      {
        name: 'name',
        message: 'What is the name of the theme?'
      },
      {
        type: 'list',
        name: 'scssCompiler',
        message: 'How do you want to compile Scss?',
        choices: [
          {
            value: 'libsass',
            name: 'Libsass with Bourbon'
          },{
            value: 'compass',
            name: 'Ruby with Compass'
          }
        ]
      }
    ];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;

      done();
    }.bind(this));
  },

  writing: {
    app: function () {

        this.fs.copyTpl(
          this.templatePath('_package.json'),
          this.destinationPath('package.json'),
          this.props
        );


      // if (this.props.taskRunner === 'Grunt') {}

      this.fs.copyTpl(
        this.templatePath('_Gruntfile.js'),
        this.destinationPath('Gruntfile.js')
      );

      // gruntconfig.scssDir = 'scss/';
      // gruntconfig.scssConfigRoot = './';

      if (this.props.scssCompiler === 'compass') {
        this.fs.copy(
          this.templatePath('config/compass/compass.js'),
          this.destinationPath('config/compass/compass.js')
        );
        this.fs.copy(
          this.templatePath('config/compass/config.rb'),
          this.destinationPath('config/compass/config.rb')
        );
        this.fs.copy(
          this.templatePath('config/compass/Gemfile'),
          this.destinationPath('config/compass/Gemfile')
        );
        this.gruntfile.prependJavaScript('require("config/compass/compass.js")(grunt, config);');
      } else if (this.props.scssCompiler === 'libsass') {
        this.fs.copy(
          this.templatePath('config/libsass/libsass.js'),
          this.destinationPath('config/libsass/libsass.js')
        );
        this.fs.copy(
          this.templatePath('config/libsass/Gemfile'),
          this.destinationPath('config/libsass/Gemfile')
        );
        this.gruntfile.prependJavaScript('require("config/libsass/libsass.js")(grunt, config);');
        this.npmInstall(['grunt-sass', 'grunt-sass-globbing'], {'saveDev': true});
      }

      this.fs.copyTpl(
        this.templatePath('config/Gruntconfig.yml'),
        this.destinationPath('Gruntconfig.yml')
      )

      // must comes last, so it is at top of file and everything else can use it
      this.gruntfile.prependJavaScript('var config = grunt.file.readYAML("Gruntconfig.yml");')

    },

    projectfiles: function () {
      this.fs.copyTpl(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copyTpl(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
    }
  },

  install: function () {
    // this.installDependencies();
  }
});
