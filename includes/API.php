<?php

namespace WDG\C3Charts;

class API {

	use SingletonTrait;

	protected function __construct() {
		add_filter( 'rest_prepare_attachment', [ $this, 'rest_prepare_attachment' ], 10, 3 );
		add_action( 'attachment_updated', [ $this, 'update_csv_metadata' ] );
		add_action( 'add_attachment', [ $this, 'update_csv_metadata' ] );
	}

	/**
	 * Add our c3 chart data to csv files only
	 *
	 * @param \WP_REST_Response $response
	 * @param \WP_Post $post
	 * @param \WP_REST_Request $request
	 * @return void
	 */
	public function rest_prepare_attachment( $response, $post, $request ) {
		if ( 'text/csv' === get_post_mime_type( $post->ID ) ) {
			$response->data['c3ChartData']      = (object) get_post_meta( $post->ID, '_wdg_c3_charts', true );
			$response->data['c3ChartData']->raw = $this->get_csv_data( $post->ID );
		}

		return $response;
	}

	/**
	 * Remove any non printable characters from a string
	 *
	 * @param string $str
	 * @return string
	 */
	protected static function remove_non_visible_chars( $str ) {
		return preg_replace( '/[^[:print:]]/', '', $str );
	}

	/**
	 * Get the raw csv data for an attachment
	 *
	 * @param int $attachment_id
	 * @return array
	 */
	public static function get_csv_data( $attachment_id = null ) {
		$attachment_id = $attachment_id ?? get_the_ID();
		$attached_file = get_attached_file( $attachment_id );

		$handle = fopen( $attached_file, 'r' );
		$data = [];

		if ( false !== $handle ) {
			while ( ! feof( $handle ) ) {
				$row = fgetcsv( $handle );

				if ( ! is_array( $row ) ) {
					continue;
				}

				$row = array_map( [ __CLASS__, 'remove_non_visible_chars' ] , $row );
				array_push( $data, $row );
			}

			fclose( $handle );
		}

		return $data;
	}

	/**
	 * Extract headers and line count from a csv file on upload
	 *
	 * @param int $attachment_id
	 * @return void
	 * @action attachment_updated, add_attachment
	 */
	public function update_csv_metadata( $attachment_id ) {
		if ( 'text/csv' !== get_post_mime_type( $attachment_id ) ) {
			return;
		}

		$attached_file = get_attached_file( $attachment_id );

		$data              = new \StdClass();
		$data->count       = 0;
		$data->headers     = [];
		$data->firstColumn = [];

		$handle = fopen( $attached_file, 'r' );

		if ( false === $handle ) {
			return;
		}

		while ( ! feof( $handle ) ) {
			$row = fgetcsv( $handle );

			if ( ! is_array( $row ) ) {
				continue;
			}

			$data->count++; // keep the line count
			$row = array_map( [ __CLASS__, 'remove_non_visible_chars' ], $row ); // remove non-visible characters

			if ( 1 === $data->count ) {
				$data->headers = $row; // save the first line as headers
			}

			array_push( $data->firstColumn, current( $row ) ); // save the first column
		}

		fclose( $handle );

		update_post_meta( $attachment_id, '_wdg_c3_charts', $data );
	}
}
