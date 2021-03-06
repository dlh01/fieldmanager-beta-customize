module.exports = function( grunt ) {
	'use strict';

	var banner = '/**\n * <%= pkg.homepage %>\n * Copyright (c) <%= grunt.template.today("yyyy") %>\n * This file is generated automatically. Do not edit.\n */\n';

	// Project configuration
	grunt.initConfig( {
		pkg: grunt.file.readJSON( 'package.json' ),

		addtextdomain: {
			options: {
				textdomain: 'fieldmanager-beta-customize',
			},
			target: {
				files: {
					src: [ '*.php', '**/*.php', '!node_modules/**', '!php-tests/**', '!bin/**' ]
				}
			}
		},

		connect: {
			server: {
				options: {
					base: '.'
				}
			}
		},

		makepot: {
			target: {
				options: {
					domainPath: '/languages',
					mainFile: 'fieldmanager-beta-customize.php',
					potFilename: 'fieldmanager-beta-customize.pot',
					potHeaders: {
						poedit: true,
						'x-poedit-keywordslist': true
					},
					type: 'wp-plugin',
					updateTimestamp: true
				}
			}
		},

		qunit: {
			trunk: {
				options: {
					urls: ['http://localhost:8000/tests/js/index.html']
				}
			},
			recent: {
				options: {
					urls: [
						'http://localhost:8000/tests/js/index.html',
						'http://localhost:8000/tests/js/index.html?wp=4.7',
						'http://localhost:8000/tests/js/index.html?wp=4.6',
					]
				}
			},
			specific: {
				options: {
					urls: [ 'http://localhost:8000/tests/js/index.html?wp=' + grunt.option( 'wp' ) ]
				}
			}
		},

		wp_readme_to_markdown: {
			options: {
				screenshot_url: './assets/{screenshot}.png',
			},
			your_target: {
				files: {
					'README.md': 'readme.txt'
				}
			},
		},
	} );

	grunt.loadNpmTasks( 'grunt-contrib-connect' );
	grunt.loadNpmTasks( 'grunt-contrib-qunit' );
	grunt.loadNpmTasks( 'grunt-wp-i18n' );
	grunt.loadNpmTasks( 'grunt-wp-readme-to-markdown' );

	if ( /(qunit|prerelease)/.test( grunt.cli.tasks.join( '' ).toLowerCase() ) ) {
		grunt.task.run( 'connect' );
	}

	grunt.registerTask( 'i18n', [ 'addtextdomain', 'makepot' ] );
	grunt.registerTask( 'readme', [ 'wp_readme_to_markdown' ] );
	grunt.registerTask( 'prerelease', [ 'qunit:recent', 'i18n', 'readme' ] );

	grunt.util.linefeed = '\n';
};
