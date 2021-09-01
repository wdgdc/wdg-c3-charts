<?php

namespace WDG\C3Charts;

trait SingletonTrait {

	/**
	 * Get the instance of the called class
	 *
	 * @param mixed $args
	 * @return \StdClass
	 */
	public static function instance() {
		static $instance;

		if ( ! isset( $instance ) ) {
			$instance = new static( func_get_args() );
		}

		return $instance;
	}
}
