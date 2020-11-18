<?php

defined( 'ABSPATH' ) || exit();

if ( ! class_exists( 'WP_AJAX_Enqueue' ) ) {
	class WP_AJAX_Enqueue {
		/** @var null */
		private static $instance = null;

		/**
		 * WP_AJAX_Enqueue constructor.
		 */
		public function __construct() {
			add_action( 'wp_enqueue_scripts', [ $this, 'frontend_scripts' ] );
		}

		public function frontend_scripts() {

			wp_enqueue_script( 'wp-ajax-script', WP_AJAX_ASSETS . '/js/frontend.min.js', [ 'jquery', 'wp-util' ], WP_AJAX_VERSION, true );

			wp_localize_script( 'wp-ajax-script', 'wpAjax', [
				'plugin_url' => WP_AJAX_URL,
			] );
		}

		/**
		 * @return WP_AJAX_Enqueue|null
		 */
		public static function instance() {
			if ( is_null( self::$instance ) ) {
				self::$instance = new self();
			}

			return self::$instance;
		}
	}

}

WP_AJAX_Enqueue::instance();
