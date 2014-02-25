/*global module, require*/
module.exports = function(grunt) {
  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    'nice-package': {
      all: {
        options: {
        }
      }
    },

    sync: {
      all: {
        options: {
          sync: ['author', 'name', 'version', 'private', 'license', 'keywords'],
        }
      }
    },

    bower: {
      install: {
        options: {
          targetDir: 'bower_components',
          copy: false,
          verbose: true,
          bowerOptions: {
            forceLatest: true
          }
        }
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      'default': {
        src: ['Gruntfile.js', 'src/*.js']
      }
    },

    'jshint-solid': {
      all: {
        options: {}
      }
    },

    coffeelint: {
      options: {
        max_line_length: {
          level: 'ignore'
        }
      },
      app: ['src/*.coffee']
    },

    // compile and concat into single file
    browserify: {
      'tmp/app.js': ['src/*.coffee'],
      options: {
        transform: ['coffeeify']
      }
    },

    uglify: {
      components: {
        files: {
          'tmp/app.min.js': ['tmp/app.js']
        }
      }
    },

    copy: {
      main: {
        files: {
          'dist/README.md': 'README.md'
        }
      }
    },

    watch: {
      all: {
        files: ['Gruntfile.js', 'index.jade',
          'partials/*',
          'src/**/*.js', 'src/**/*.coffee', 'css/**/*.css', 'styles/**/*'],
        tasks: ['build']
      }
    }
  });

  var plugins = require('matchdep').filterDev('grunt-*');
  plugins.forEach(grunt.loadNpmTasks);

  grunt.registerTask('check', ['deps-ok', 'nice-package', 'jshint-solid', 'coffeelint', 'sync', 'bower']);
  grunt.registerTask('build', ['browserify', 'copy']);
  grunt.registerTask('default', ['check', 'build']);
};
