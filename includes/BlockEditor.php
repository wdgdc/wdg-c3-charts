<?php

namespace WDG\C3Charts;

/**
 * The BlockEditor class registers and manages block registration, assets, and rendering
 *
 * @package wdg-c3-charts
 * @author kshaner
 */
class BlockEditor {

	use SingletonTrait;

	/**
	 * The list of supported blocks
	 *
	 * @var array
	 */
	protected array $blocks = [
		'area',
		'area-spline',
		'bar',
		'donut',
		'line',
		'pie',
		'scatter',
		'spline',
	];

	/**
	 * The default color scheme
	 *
	 * @var array
	 */
	protected array $colors = [
		'#1f77b4',
		'#B84645',
		'#B1812C',
		'#046C9D',
		'#9FA1A8',
		'#DCB56E',
	];

	/**
	 * Holds per chart color schemes by key => hex codes
	 *
	 * @var array
	 */
	protected array $color_schemes = [];

	/**
	 * Hook into wordpress
	 *
	 * @return BlockEditor
	 */
	protected function __construct() {
		add_action( 'init', [ $this, 'init' ] );
		add_action( 'wp_enqueue_scripts', [ $this, 'wp_enqueue_scripts' ] );
		add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue_block_editor_assets' ], 11 );
		add_filter( 'block_categories_all', [ $this, 'block_categories' ], 10, 2 );
	}

	/**
	 * Script data to be registered
	 *
	 * @var array
	 */
	protected array $scripts = [
		'wdg-c3-charts-block-editor' => [
			'src'    => WDG_C3_CHARTS_URI . '/dist/index.js',
			'deps'   => [
				'wdg-c3-charts-d3',
				'wdg-c3-charts-c3',
				'wp-blocks',
				'wp-dom-ready',
				'wp-edit-post',
				'wp-editor',
				'wp-hooks',
				'lodash',
			],
			'footer' => false,
		],
		'wdg-c3-charts-d3' => [
			'src'    => WDG_C3_CHARTS_URI . '/dist/d3/d3.min.js',
			'debug'  => WDG_C3_CHARTS_URI . '/dist/d3/d3.js',
			'ver'    => '5.16.0',
			'footer' => false,
			'attr'   => [ 'defer' => true ],
		],
		'wdg-c3-charts-c3' => [
			'src'    => WDG_C3_CHARTS_URI . '/dist/c3/c3.min.js',
			'debug'  => WDG_C3_CHARTS_URI . '/dist/c3/c3.js',
			'deps'   => [ 'wdg-c3-charts-d3' ],
			'ver'    => '0.7.20',
			'footer' => false,
			'attr'   => [ 'defer' => true ],
		],
		'wdg-c3-charts' => [
			'src'    => WDG_C3_CHARTS_URI . '/dist/render.js',
			'deps'   => [ 'wdg-c3-charts-c3' ],
			'footer' => false,
			'attr'   => [ 'defer' => true ],
		],
	];

	/**
	 * Style data to be registered
	 */
	protected array $styles = [
		'wdg-c3-charts-c3' => [
			'src' => WDG_C3_CHARTS_URI . '/dist/c3/c3.css',
			'media' => 'all',
		],
		'wdg-c3-charts' => [
			'src'   => WDG_C3_CHARTS_URI . '/src/index.css',
			'deps'  => [ 'wdg-c3-charts-c3' ],
			'media' => 'all',
		],
	];

	/**
	 * Register blocks and assets (init action)
	 *
	 * @return void
	 */
	public function init() {
		$this->colors = apply_filters( 'wdg/c3/chart-colors', $this->colors );

		foreach ( $this->blocks as $block ) {
			$this->register_block( sprintf( '%s/src/blocks/%s/block.json', untrailingslashit( WDG_C3_CHARTS_DIR ), $block ) );
			$this->color_schemes[ $block ] = apply_filters( "wdg/c3/chart-colors/$block", $this->colors, $block );
		}

		$script_debug = defined( 'SCRIPT_DEBUG' ) && empty( constant( 'SCRIPT_DEBUG' ) );

		foreach ( $this->scripts as $handle => &$script ) {
			if ( $script_debug && ! empty( $script_debug['debug'] ) ) {
				$script['src'] = $script['debug'];

				$script['ver'] = filemtime( $this->path . '/' . $script['src'] );
			}

			wp_register_script( $handle, $script['src'] ?? '', $script['deps'] ?? [], $script['ver'] ?? WDG_C3_CHARTS_VERSION, $script['footer'] ?? false );

			if ( ! empty( $script['attr'] ) ) {
				// apply custom attributes on the script tag
				add_filter(
					'script_loader_tag',
					function( $tag, $tag_handle, $src ) use ( $script, $handle ) {
						$attr = $script['attr'];

						if ( ! apply_filters( 'wdg/c3/script_defer', true ) ) {
							$attr['defer'] = false;
						}

						if ( $handle === $tag_handle ) {
							// don't allow defer/async in admin or customizer
							if ( is_admin() || is_customize_preview() ) {
								$attr = array_diff_key( $attr, array_fill_keys( [ 'defer', 'async' ], null ) );
							}

							$attr_string = '';
							foreach( $attr as $prop => $val ) {
								if ( true === $val ) {
									$attr_string .= sprintf( ' %s', $prop );
								} else if ( ! empty( $val ) ) {
									$attr_string .= sprintf( ' %s="%s"', $prop, $val );
								}
							}

							$tag = str_replace( ' src=', esc_attr( $attr_string ) . ' src=', $tag );
						}

						return $tag;
					},
					10,
					3
				);
			}
		}

		foreach ( $this->styles as $handle => $style ) {
			wp_register_style( $handle, $style['src'] ?? '', $style['deps'] ?? [], $style['ver'] ?? WDG_C3_CHARTS_VERSION, $style['media'] ?? 'all' );
		}
	}

	/**
	 * Register a block by path with arguments and default callbacks & assets
	 *
	 * @param string $path
	 * @param array $args
	 * @return \WP_Block_Type|false
	 */
	protected function register_block( $path, $args = [] ) {
		static $schema;

		if ( ! isset( $schema ) ) {
			$schema = json_decode( file_get_contents( WDG_C3_CHARTS_DIR . '/src/blocks/schema.json' ), true );
		}

		$block = json_decode( file_get_contents( $path ), true );

		$args = [
			'attributes' => array_merge( $schema, $block['attributes'] ?? [] ),
			'style'      => 'wdg-c3-charts',
			'script'     => 'wdg-c3-charts',
		];

		$view = dirname( $path ) . '/view.php';

		if ( file_exists( $view ) ) {
			$args['render_callback'] = function( $attributes, $content, $block ) use ( $view ) {
				ob_start();
				include $view;
				return ob_get_clean();
			};
		}

		return register_block_type( $block['name'], $args );
	}

	/**
	 * Enqueue the front end scripts
	 *
	 * @return void
	 */
	public function wp_enqueue_scripts() {
		wp_enqueue_script( 'wdg-c3-charts' );
		wp_enqueue_style( 'wdg-c3-charts' );
	}

	/**
	 * Enqueue assets for the block editor
	 *
	 * @return void
	 */
	public function enqueue_block_editor_assets() {
		wp_add_inline_script( 'wdg-c3-charts-block-editor', sprintf( 'var wdg = wdg || {}; wdg.charts = wdg.charts || {}; wdg.charts.config = %s', wp_json_encode( $this->get_block_editor_config() ) ), 'before' );
		wp_enqueue_script( 'wdg-c3-charts-block-editor' );
		wp_enqueue_style( 'wdg-c3-charts-c3' );
	}

	/**
	 * add a chart block category
	 *
	 * @param array $categories
	 * @param \WP_Post $post
	 * @return array
	 */
	public function block_categories( $categories, $post ) {
		array_unshift(
			$categories,
			[
				'slug'  => 'charts',
				'title' => 'Charts',
			]
		);

		return $categories;
	}

	/**
	 * Get config for the block-editor scripts
	 *
	 * @return array
	 */
	public function get_block_editor_config() {
		return [
			'color' => [
				'pattern' => $this->colors
			],
			'schemes' => $this->color_schemes,
		];
	}

	/**
	 * Render the chart via block callback proxy
	 *
	 * @param string $type - chart type
	 * @param array $attributes - block attributes that hold c3 configuration
	 * @param string $caption - block caption including figcaption
	 * @return void
	 */
	public function render( $type, $attributes, $caption = '' ) {
		if ( isset( $attributes['data']['url'] ) ) {
			unset( $attributes['data']['url'] );
		}

		if ( ! empty( $attributes['file'] ) ) {
			$attributes['data']['rows'] = \WDG\C3Charts\API::instance()->get_csv_data( $attributes['file'] );
		}

		$data = isset( $attributes['file'] ) ? get_post_meta( $attributes['file'], '_wdg_c3_charts', true ) : [];

		$attributes['data']['type']     = $type;
		$attributes['color']['pattern'] = $this->color_schemes[ $type ] ?? $this->colors;

		// special handling for custom x axis tick labels
		if ( isset( $attributes['axis']['x']['type'] ) && isset( $data->firstColumn ) ) {
			if ( isset( $data->firstColumn ) ) {
				array_shift( $data->firstColumn );
			}

			if ( 'first-column' === $attributes['axis']['x']['type'] ) {
				$attributes['axis']['x']['type'] = 'category';
				$attributes['axis']['x']['categories'] = $data->firstColumn;
				$attributes['data']['rows'] = array_map( fn( $row ) => array_slice( $row, 1 ), $attributes['data']['rows'] );

				unset( $attributes['data']['url'] );
			}
		}

		$config = apply_filters( 'wdg/c3/chart-config', $attributes, $type );

		// unset config irrelevant to c3
		$config = array_diff_key( $config, array_flip( [ 'file' ] ) );

		if ( isset( $config['caption'] ) ) {
			unset( $config['caption'] );
		}

		$error = false;

		if ( empty( $attributes['data']['url'] ) && empty( $attributes['data']['json'] ) && empty( $attributes['data']['rows'] ) ) {
			$error = new \WP_Error( 'invalid-chart-data', 'Invalid Chart Data' );
			$attributes['data']['type'] = 'error';
		}

		printf( '<figure class="wdg-c3-chart wdg-c3-chart--%1$s" data-type="%1$s">' . "\n", esc_attr( $attributes['data']['type'] ) );

		if ( in_array( $attributes['data']['type'], [ 'area', 'area-spline', 'bar', 'line', 'spline' ], true ) && ( ! empty( $attributes['chartLabel'] ) || ! empty( $attributes['chartLabel2'] ) ) ) :
			echo "\t" . '<div class="wdg-c3-chart__labels">' . "\n";

			if ( ! empty( $attributes['chartLabel'] ) ) :
				printf( "\t\t" . '<p class="wdg-c3-chart__label wdg-c3-chart__label--1">%s</p>' . "\n", wp_kses_post( $attributes['chartLabel'] ) );
			endif;

			if ( ! empty( $attributes['chartLabel2'] ) ) :
				printf( "\t\t" . '<p class="wdg-c3-chart__label wdg-c3-chart__label--2">%s</p>' . "\n", wp_kses_post( $attributes['chartLabel2'] ) );
			endif;

			echo "\t" . '</div>' . "\n";
		endif;

		if ( is_wp_error( $error ) ) :
			if ( is_user_logged_in() && current_user_can( 'edit_others_posts' ) ) :
				$format = '<mark>%s</mark>';
			else:
				$format = '<!-- %s -->';
			endif;

			printf( $format . "\n", $error->get_error_message() );
		else:
			printf( "\t" . '<script type="application/json">%s</script>' . "\n", wp_json_encode( $config ) );
		endif;

		if ( ! empty( $caption ) ) :
			echo "\t" . wp_kses_post( trim( $caption ) ) . "\n";
		endif;

		echo "</figure>\n";
	}
}
