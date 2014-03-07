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

    stylus: {
      compile: {
        options: {
          compress: false
        },
        files: {
          'dist/slides-now-core.css': ['slides-now-core.styl']
        }
      }
    },

    concat: {
      css_app: {
        options: {
          separator: '\n',
          stripBanners: true,
          banner: '/*! <%= pkg.name %> - <%= pkg.version %> */\n\n'
        },
        files: {
          'dist/slides-now-core.css': ['dist/slides-now-core.css']
        }
      },
      js_app: {
        options: {
          separator: ';\n',
          stripBanners: false,
          banner: '/*! <%= pkg.name %> - <%= pkg.version %> ' +
          'built on <%= grunt.template.today("yyyy-mm-dd") %>\n' +
          'author: <%= pkg.author %>, support: @bahmutov */\n\n'
        },
        src: [
          'src/recenter.js',
          'src/recenterImages.js',
          'src/recenterCodeBlocks.js',
          'tmp/app.js'
        ],
        dest: 'dist/slides-now-core.js'
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
          'dist/README.md': 'README.md',
          'dist/bower_components/bespoke.js': 'bower_components/bespoke.js/dist/bespoke.js',
          'dist/bower_components/bespoke-hash.js': 'bower_components/bespoke-hash/dist/bespoke-hash.js',
          'dist/bower_components/flowType.js': 'components/flowType/flowtype.js',
          'dist/bower_components/code-box.js': 'bower_components/code-box/code-box.js',
          'dist/bower_components/code-box.css': 'bower_components/code-box/code-box.css',
          'dist/bower_components/es5-shim.js': 'bower_components/es5-shim/es5-shim.js',
          'dist/index-page-tests.js': 'test/index-page-tests.js'
        }
      }
    },

    watch: {
      all: {
        files: ['Gruntfile.js', 'index.jade', '*.styl', 'src/**/*.js', 'src/**/*.coffee', 'test/*'],
        tasks: ['build', 'qunit']
      }
    },

    jade: {
      index: {
        options: {
          pretty: true,
          data: {
            version: 'version: <%= pkg.version %>',
            timestamp: 'timestamp: <%= grunt.template.today() %>'
          }
        },
        files: {
          'dist/index.html': 'index.jade'
        }
      }
    },

    filenames: {
      src: {
        options: {
          valid: /^[a-z]+\.coffee$/
        },
        src: ['src/**/*.coffee']
      }
    },

    qunit: {
      all: ['dist/index.html']
    },

    'gh-pages': {
      options: {
        base: 'dist'
      },
      src: [
        'index.html',
        'README.md',
        '*.js',
        '*.css',
        'bower_components/**/*'
      ]
    }
  });

  grunt.registerMultiTask('filenames', 'Validates source filenames', function () {
    var basename = require('path').basename;
    var options = this.options({
      valid: /^[a-z][a-zA-Z]\./
    });
    grunt.verbose.writeln('Validating filenames using RegExp', options.valid);
    var allValid = this.files.every(function (file) {
      return file.src.every(function (filename) {
        grunt.verbose.writeln('testing filename', filename);
        var valid = options.valid.test(basename(filename));
        if (!valid) {
          grunt.log.error('file', filename, 'does not pass check', options.valid);
        }
        return valid;
      });
    });
    return allValid;
  });

  var plugins = require('matchdep').filterDev('grunt-*');
  plugins.forEach(grunt.loadNpmTasks);

  grunt.registerTask('check', ['deps-ok', 'nice-package', 'jshint-solid', 'coffeelint', 'sync', 'bower']);
  grunt.registerTask('build', ['stylus', 'browserify', 'concat', 'copy', 'jade']);
  grunt.registerTask('default', ['check', 'build', 'qunit']);
  grunt.registerTask('run', ['default', 'watch']);
};
