<?php
/**
 * Charts with c3.js
 *
 * @package   c3-charts
 * @link      https://github.com/wdgdc/wdg-c3-charts
 * @author    WDG
 * @copyright 2021 Web Development Group
 * @license   MIT
 *
 * Plugin Name:  c3 Charts
 * Description:  Charting Library with c3.js
 * Version:      1.2.2
 * Plugin URI:   https://github.com/wdgdc/wdg-c3-charts
 * Author:       Web Development Group
 * Author URI:   https://www.wdg.co
 * Text Domain:  c3-charts
 * Requires PHP: 7.3
 */

namespace WDG\C3Charts;

if ( ! defined( 'ABSPATH' ) ) {
	return;
}

define( 'WDG_C3_CHARTS_VERSION', '1.2.2' );

if ( ! defined( 'WDG_C3_CHARTS_DIR' ) ) {
	define( 'WDG_C3_CHARTS_DIR', __DIR__ );
}

define( 'WDG_C3_CHARTS_URI', str_replace( ABSPATH, rtrim( get_site_url(), '/' ) . '/', WDG_C3_CHARTS_DIR ) );

require_once __DIR__ . '/vendor/autoload.php';

add_action( 'plugins_loaded', __NAMESPACE__ . '\\BlockEditor::instance' );
add_action( 'plugins_loaded', __NAMESPACE__ . '\\API::instance' );
