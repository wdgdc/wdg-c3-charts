<?php
/**
 * Charts with c3.js
 *
 * Plugin Name:  c3 Charts
 * Description:  Charting Library with c3.js
 * Version:      1.4.0.6
 * Plugin URI:   https://github.com/wdgdc/wdg-c3-charts
 * Author:       Web Development Group
 * Author URI:   https://www.wdg.co
 * Text Domain:  c3-charts
 * Requires PHP: 7.4
 *
 * @package   wdg-c3-charts
 * @link      https://github.com/wdgdc/wdg-c3-charts
 * @author    WDG
 * @copyright 2021-2022 Web Development Group
 * @license   MIT
 */

namespace WDG\C3Charts;

if ( ! defined( 'ABSPATH' ) ) {
	return;
}

/**
 * PSR-4 Autoload function for our namespace to be used with spl_autoload_register
 *
 * @param string $fqcn - fully qualified class name
 * @param string $ns - the namespace of the class to watch for
 * @param string $dir - the source directory that contains the namespaced class files
 * @return void
 *
 * @see https://www.php-fig.org/psr/psr-4/
 */
function autoload( $fqcn, $ns = __NAMESPACE__, $dir = __DIR__ . '/includes' ) {
	$ns = rtrim( $ns, '\\' ) . '\\'; // ensure we're working with only the specified ns and not an ns that starts the same string

	if ( strpos( $fqcn, $ns ) === 0 ) {
		$fpath = rtrim( $dir, '/' ) . '/' . substr( str_replace( '\\', '/', $fqcn ), strlen( $ns ) ) . '.php';

		if ( file_exists( $fpath ) ) {
			include_once $fpath;
		}
	}
}

/**
 * Get the version of the plugin from comment for usage in php
 *
 * @param string $file path to file
 * @return string version number defined on the comment block or modified time of particular file
 *
 * @uses get_file_data to parse the version number from the file comment
 */
function version( $file = __FILE__ ) {
	static $version;

	if ( ! isset( $version ) ) {
		$file_data = get_file_data( $file, [ 'Version' => 'Version' ] );

		$version = $file_data['Version'] ?? filemtime( $file );
	}

	return $version;
}

if ( ! defined( 'WDG_C3_CHARTS_DIR' ) ) {
	/**
	 * The absolute path to the plugin directory
	 *
	 * @var string
	 */
	define( 'WDG_C3_CHARTS_DIR', __DIR__ );
}

if ( ! defined( 'WDG_C3_CHARTS_URI' ) ) {
	/**
	 * The URI to the plugin directory to use when registering assets
	 *
	 * @var string
	 */
	define( 'WDG_C3_CHARTS_URI', str_replace( ABSPATH, rtrim( home_url(), '/' ) . '/', WDG_C3_CHARTS_DIR ) );
}

if ( ! defined( 'WDG_C3_CHARTS_VERSION' ) ) {
	/**
	 * The version defined in the comment file of the plugin
	 *
	 * @var string
	 */
	define( 'WDG_C3_CHARTS_VERSION', version( __FILE__ ) );
}

spl_autoload_register( __NAMESPACE__ . '\\autoload' );
add_action( 'plugins_loaded', __NAMESPACE__ . '\\BlockEditor::instance' );
add_action( 'plugins_loaded', __NAMESPACE__ . '\\API::instance' );
