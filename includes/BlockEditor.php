<?php

namespace WDG\C3Charts;

class BlockEditor {

	use SingletonTrait;

	protected array $blocks = [
		'area',
		'area-spline',
		'bar',
		'donut',
		'line',
		'pie',
		'spline',
	];

	protected array $colors = [
		'#1f77b4',
		'#B84645',
		'#B1812C',
		'#046C9D',
		'#9FA1A8',
		'#DCB56E',
	];

	protected array $color_schemes = [];

	protected function __construct() {
		add_action( 'init', [ $this, 'init' ] );
		add_action( 'wp_enqueue_scripts', [ $this, 'wp_enqueue_scripts' ] );
		add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue_block_editor_assets' ], 11 );
		add_filter( 'block_categories', [ $this, 'block_categories' ], 10, 2 );
	}

	public function __callStatic( $name, $arguments ) {
		return call_user_func_array( [ self::instance(), $name ], $arguments );
	}

	protected array $scripts = [
		'wdg-c3-charts-block-editor' => [
			'src'    => 'dist/index.js',
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
			'ver'    => WDG_C3_CHARTS_VERSION,
			'footer' => false,
		],
		'wdg-c3-charts-d3' => [
			'src'    => 'dist/d3/d3.min.js',
			'debug'  => 'dist/d3/d3.js',
			'deps'   => '',
			'ver'    => '5.16.0',
			'footer' => false,
			'attr'   => [ 'defer' => true ],
		],
		'wdg-c3-charts-c3' => [
			'src'    => 'dist/c3/c3.min.js',
			'debug'  => 'dist/c3/c3.js',
			'deps'   => [ 'wdg-c3-charts-d3' ],
			'ver'    => '0.7.20',
			'footer' => false,
			'attr'   => [ 'defer' => true ],
		],
		'wdg-c3-charts' => [
			'src'    => 'dist/render.js',
			'deps'   => [ 'wdg-c3-charts-c3' ],
			'ver'    => WDG_C3_CHARTS_VERSION,
			'footer' => false,
			'attr'   => [ 'defer' => true ],
		],
	];

	public function init() {
		$this->colors = apply_filters( 'wdg/c3/chart-colors', $this->colors );

		foreach ( $this->blocks as $block ) {
			$this->register_block( sprintf( '%s/src/blocks/%s/block.json', untrailingslashit( WDG_C3_CHARTS_DIR ), $block ) );
			$this->color_schemes[ $block ] = apply_filters( "wdg/c3/chart-colors/$block", $this->colors, $block );
		}

		$script_debug = defined( 'SCRIPT_DEBUG' ) && empty( constant( 'SCRIPT_DEBUG' ) );

		foreach ( $this->scripts as $handle => $script ) {
			if ( $script_debug && ! empty( $script_debug['debug'] ) ) {
				$script['src'] = $script['debug'];

				$script['ver'] = filemtime( $this->path . '/' . $script['src'] );
			} else if ( empty( $script['ver'] ) ) {
				$script['ver'] = WDG_C3_CHARTS_VERSION;
			}

			$script['src'] = rtrim( WDG_C3_CHARTS_URI, '/' ) . '/' . ltrim( $script['src'], '/' );

			wp_register_script(
				$handle,
				$script['src'],
				$script['deps'] ?? [],
				$script['ver'],
				$script['footer'] ?? false,
			);

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

		wp_register_style( 'wdg-c3-charts-c3', WDG_C3_CHARTS_URI . '/dist/c3/c3.css', [], WDG_C3_CHARTS_VERSION, 'all' );
		wp_register_style( 'wdg-c3-charts', WDG_C3_CHARTS_URI . '/dist/index.css', [ 'wdg-c3-charts-c3' ], WDG_C3_CHARTS_VERSION, 'all' );
	}

	protected function register_block( $path, $args = [] ) {
		static $schema;

		if ( ! isset( $schema ) ) {
			$schema = json_decode( file_get_contents( WDG_C3_CHARTS_DIR . '/src/blocks/schema.json' ), true );
		}

		$block = json_decode( file_get_contents( $path ), true );

		$args = [
			'attributes' => array_merge( $schema, $block['attributes'] ?? [] ),
			'style' => 'wdg-c3-charts',
			'script' => 'wdg-c3-charts',
		];

		$directory = dirname( $path );
		$view      = $directory . '/view.php';

		if ( file_exists( $view ) ) {
			$args['render_callback'] = function( $attributes, $content, $block ) use ( $view ) {
				ob_start();
				include $view;
				return ob_get_clean();
			};
		}

		register_block_type( $block['name'], $args );
	}

	public function wp_enqueue_scripts() {
		wp_enqueue_script( 'wdg-c3-charts' );
		wp_enqueue_style( 'wdg-c3-charts' );
	}

	public function enqueue_block_editor_assets() {
		wp_add_inline_script( 'wdg-c3-charts-block-editor', sprintf( 'var wdg = wdg || {}; wdg.charts = wdg.charts || {}; wdg.charts.config = %s', wp_json_encode( $this->get_block_editor_config() ) ), 'before' );
		wp_enqueue_script( 'wdg-c3-charts-block-editor' );
		wp_enqueue_style( 'wdg-c3-charts-c3' );
	}

	/**
	 * add a chart block category
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

	public function get_block_editor_config() {
		return [
			'color' => [
				'pattern' => $this->colors
			],
			'schemes' => $this->color_schemes,
		];
	}

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

		if ( isset( $config['caption'] ) ) {
			unset( $config['caption'] );
		}

		if ( empty( $attributes['data']['url'] ) && empty( $attributes['data']['json'] ) && empty( $attributes['data']['rows'] ) ) {
			printf(
				'<figure class="wdg-c3-chart wdg-c3-chart--error" data-type="%1$s">%2$s</figure>%3$s',
				esc_attr( $attributes['data']['type'] ),
				is_user_logged_in() ? '<mark>Invalid Chart Data</mark> ' : '<!-- Invalid Chart Data --> ' . $caption,
				"\n"
			);
		}

		printf(
			'<figure class="wdg-c3-chart wdg-c3-chart--%1$s" data-type="%1$s" data-c3-config=\'%2$s\'>%3$s</figure>%4$s',
			esc_attr( $attributes['data']['type'] ),
			wp_json_encode( $config ),
			$caption,
			"\n"
		);
	}
}
