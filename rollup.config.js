import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import rollupJson from '@rollup/plugin-json';
import rollupSvg from 'rollup-plugin-svg-import';
import wpResolve from 'rollup-plugin-wp-resolve';
import rollupCopy from 'rollup-plugin-copy';

const globals = {
	'c3': 'c3',
	'd3': 'd3',
}

const plugins = [
	wpResolve(),
	nodeResolve( { // resolve node_modules
		browser: true,
	} ),
	rollupJson(), // convert json files to es-modules
	rollupSvg( {  // import svg into bundles
		stringify: true
	} ),
	babel( {
		babelHelpers: 'bundled',
		exclude: 'node_modules/**',
		presets: [
			[
				"@babel/preset-env",
				{
					"modules": false,
				},
			],
			[
				'@babel/preset-react',
				{
					pragma: 'wp.element.createElement',
					pragmaFrag: 'wp.element.Fragment',
				}
			],
		],
	} ),
	commonjs( { // convert common/requirejs to esmodules
		exclude: [
			'assets/js/**',
			'blocks/**'
		]
	} ),
	rollupCopy( {
		targets: [
			{
				src: 'node_modules/c3/c3.{css,min.css,js,min.js}',
				dest: 'dist/c3'
			},
			{
				src: 'node_modules/d3/dist/d3.{js,min.js}',
				dest: 'dist/d3'
			},
		]
	} ),
];

export default [
	{
		input: 'src/index.js',
		external: Object.keys( globals ),
		plugins,
		output: [
			{
				file: 'dist/index.js',
				format: 'iife',
				globals,
				name: 'wdg.charts.blocks',
				plugins: [ terser() ],
				sourcemap: true,
			}
		],
	},
	{
		input: 'src/render.js',
		external: Object.keys( globals ),
		plugins,
		output: [
			{
				file: 'dist/render.js',
				format: 'iife',
				globals,
				name: 'wdg.charts.render',
				plugins: [ terser() ],
				sourcemap: true,
			}
		],
	},
];
