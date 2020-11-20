<?php

defined( 'ABSPATH' ) || exit();

if ( ! class_exists( 'WP_AJAX_Hooks' ) ) {
	class WP_AJAX_Hooks {
		/** @var null */
		private static $instance = null;

		/**
		 * WP_AJAX_Hooks constructor.
		 */
		public function __construct() {
			add_filter( 'script_loader_tag', [ $this, 'add_defer' ], 10, 2 );
		}

		//add defer attribute to wp-ajax script tag
		public function add_defer( $tag, $handle ) {
			if ( 'wp-ajax-script' === $handle && false === strpos( $tag, 'defer' ) ) {
				$tag = preg_replace( ':(?=></script>):', ' defer', $tag );
			}

			return $tag;
		}

		/**
		 * @return WP_AJAX_Hooks|null
		 */
		public static function instance() {
			if ( is_null( self::$instance ) ) {
				self::$instance = new self();
			}

			return self::$instance;
		}
	}

}

WP_AJAX_Hooks::instance();
