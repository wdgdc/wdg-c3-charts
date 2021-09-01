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
			$response->data['c3ChartData'] = get_post_meta( $post->ID, '_wdg_c3_charts', true );
		}

		return $response;
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

		$data          = new \StdClass();
		$data->count   = 0;
		$data->headers = [];

		$handle = fopen( $attached_file, 'r' );

		if ( false === $handle ) {
			return;
		}

		while ( ! feof( $handle ) ) {
			$data->count++;
			$line = fgets( $handle );

			if ( 1 === $data->count ) {
				$data->headers = array_map( fn( $header ) => preg_replace( '/[^[:print:]]/', '', $header ), explode( ',', $line ) );
			}
		}

		fclose( $handle );

		update_post_meta( $attachment_id, '_wdg_c3_charts', $data );
	}
}
