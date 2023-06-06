<?php

namespace WDG\C3Charts;

trait SingletonTrait {

    /**
	 * Get the singleton instance of the class that uses this trait
	 *
	 * @param mixed $args
	 * @return static
	 */
	public static function instance() {
		static $instance;

		if ( ! isset( $instance ) ) {
			$instance = new static( ...func_get_args() );
		}

		return $instance;
	}
}
