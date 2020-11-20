<?php

defined( 'ABSPATH' ) || exit();

if ( ! class_exists( 'WP_AJAX' ) ) {
	final class WP_AJAX {
		/** @var null */
		private static $instance = null;

		/**
		 * WP_AJAX constructor.
		 */
		public function __construct() {
			$this->includes();

			add_action( 'init', [ $this, 'lang' ] );
		}

		public function includes(){
			include WP_AJAX_INCLUDES.'/class-enqueue.php';
			include WP_AJAX_INCLUDES.'/class-hooks.php';
		}

		/**
		 * Initialize plugin for localization
		 *
		 * @return void
		 * @since 1.0.0
		 *
		 */
		public function lang() {
			load_plugin_textdomain( 'wp-ajax', false, dirname( plugin_basename( WP_AJAX_FILE ) ) . '/languages/' );
		}

		/**
		 * @return WP_AJAX|null
		 */
		public static function instance() {
			if ( is_null( self::$instance ) ) {
				self::$instance = new self();
			}

			return self::$instance;
		}
	}

}

if ( ! function_exists( 'wp_ajax' ) ) {
	function wp_ajax() {
		return WP_AJAX::instance();
	}
}

wp_ajax();
