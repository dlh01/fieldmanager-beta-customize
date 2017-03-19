<?php
/**
 * PHPUnit bootstrap file
 *
 * @package Fieldmanager_Beta_Customize
 */

$_tests_dir = getenv( 'WP_TESTS_DIR' );
if ( ! $_tests_dir ) {
	$_tests_dir = '/tmp/wordpress-tests-lib';
}

// Give access to tests_add_filter() function.
require_once( $_tests_dir . '/includes/functions.php' );

/**
 * Load our plugin and plugins assumed to be installed alongside it.
 */
tests_add_filter( 'muplugins_loaded', function () {
	require_once( dirname( dirname( __FILE__ ) ) . '/../../wordpress-fieldmanager/fieldmanager.php' );
	require_once( dirname( dirname( __FILE__ ) ) . '/../fieldmanager-beta-customize.php' );
} );

/**
 * Load our classes and the core classes we use or extend.
 */
tests_add_filter( 'init', function () {
	require_once( ABSPATH . WPINC . '/class-wp-customize-manager.php' );
	require_once( ABSPATH . WPINC . '/class-wp-customize-setting.php' );
	require_once( ABSPATH . WPINC . '/class-wp-customize-panel.php' );
	require_once( ABSPATH . WPINC . '/class-wp-customize-section.php' );
	require_once( ABSPATH . WPINC . '/class-wp-customize-control.php' );

	fm_beta_customize_load_plugin_classes();
}, 0 );

// Start up the testing environment.
require_once( $_tests_dir . '/includes/bootstrap.php' );
require_once( dirname( __FILE__ ) . '/testcase/class-fieldmanager-beta-customize-unittestcase.php' );
