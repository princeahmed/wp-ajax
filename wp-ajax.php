<?php

/**
 * Plugin Name: WP AJAX
 * Plugin URI: https://wpmilitary.com/wp-ajax
 * Description: Make website better, faster loading, more interactive & user friendly by Ajaxifying.
 * Author: WP-Military
 * Author URI: https://wpmilitary.com
 * Text Domain: wp-ajax
 * Domain Path: /languages/
 * License:     GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 */

defined( 'ABSPATH' ) || exit();

define( 'WP_AJAX_VERSION', '1.0.0' );
define( 'WP_AJAX_FILE', __FILE__ );
define( 'WP_AJAX_PATH', dirname( WP_AJAX_FILE ) );
define( 'WP_AJAX_INCLUDES', WP_AJAX_PATH . '/includes' );
define( 'WP_AJAX_URL', plugins_url( '', WP_AJAX_FILE ) );
define( 'WP_AJAX_ASSETS', WP_AJAX_URL . '/assets' );
define( 'WP_AJAX_TEMPLATES', WP_AJAX_PATH . '/templates' );


/** do the activation stuffs */
register_activation_hook( WP_AJAX_FILE, function () {
		//include WP_AJAX_INCLUDES . '/class-install.php';
} );


include WP_AJAX_INCLUDES . '/class-base.php';
