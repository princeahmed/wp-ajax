<?php

/** block direct access */
defined( 'ABSPATH' ) || exit;

/** check if class `WP_AJAX_Install` not exists yet */
if ( ! class_exists( 'WP_AJAX_Install' ) ) {
	/**
	 * Class Install
	 */
	class WP_AJAX_Install {

		/**
		 * @var null
		 */
		private static $instance = null;

		/**
		 * Do the activation stuff
		 *
		 * @return void
		 * @since 1.0.0
		 */
		public function __construct() {
			self::create_default_data();
		}


		/**
		 * create default data
		 *
		 * @since 2.0.8
		 */
		private static function create_default_data() {

			update_option( 'wp_ajax_version', WP_AJAX_VERSION );

			$install_date = get_option( 'wp_ajax_install_time' );

			if ( empty( $install_date ) ) {
				update_option( 'wp_ajax_install_time', time() );
			}

		}

		/**
		 * @return WP_AJAX_Install|null
		 */
		public static function instance() {
			if ( is_null( self::$instance ) ) {
				self::$instance = new self();
			}

			return self::$instance;
		}

	}
}

WP_AJAX_Install::instance();
