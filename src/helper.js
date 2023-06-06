import defaultConfig from './config.js';
import { createBlock } from '@wordpress/blocks';

export function parseConfig( config, custom = {} ) {
	let chartConfig = { ...defaultConfig, ...config, ...custom };

	chartConfig.data.axes = chartConfig.data.axes || {};

	if ( chartConfig.axis && chartConfig.axis.y && chartConfig.axis.y.secondary ) {
		chartConfig.data.axes = {};

		if ( chartConfig.data.rows.length > 0 ) {
			chartConfig.data.rows[0].filter( v => v ).forEach( row => {
				if ( ( Array.isArray( chartConfig.axis.y.secondary ) && chartConfig.axis.y.secondary.includes( row ) ) || chartConfig.axis.y.secondary === row ) {
					chartConfig.data.axes[ row ] = 'y2';
				} else {
					chartConfig.data.axes[ row ] = 'y';
				}
			} );

			chartConfig.axis.y2.show = Object.keys( chartConfig.data.axes ).map( key => chartConfig.data.axes[ key ] ).filter( y => y === 'y2' ).length > 0;
		} else {
			// leave it up to the chart type to decide
		}
	}

	// "auto" padding
	if ( chartConfig?.padding?.auto ) {
		delete chartConfig.padding;
	}

	// ignoring caption
	if ( chartConfig.hasOwnProperty('caption') ) {
		delete chartConfig.caption;
	}

	// apply custom timeseries formats
	if ( '%Y:$QQ' === chartConfig.axis.x.tick.format ) {
		chartConfig.axis.x.tick.format = function( d ) {
			const quarters = [1,1,1,2,2,2,3,3,3,4,4,4];
			return `${ d.getFullYear() }:Q${ quarters[ d.getMonth() ] }`;
		}
	} else if ( '%Y:$HH' === chartConfig.axis.x.tick.format ) {
		chartConfig.axis.x.tick.format = function( d ) {
			return `${ d.getFullYear() }:H${ d.getMonth() <= 5 ? '1' : '2' }`;
		}
	}

	if ( chartConfig.axis && chartConfig.axis.y && chartConfig.axis.y.label && ! chartConfig.axis.y.label.text ) {
		delete chartConfig.axis.y.label;
	}

	// add trend line to chart
	if ( chartConfig.trend && chartConfig.trend.show ) {
		const trendCalc = calcDataTrend( chartConfig, chartConfig.trend.col );

		if ( trendCalc ) {
			const label = chartConfig.trend.label || 'Trend';

			chartConfig.data.types = {
				...( config.data.types || {} ),
				[ label ]: 'line'
			};

			chartConfig.data.rows = [ ...chartConfig.data.rows ];

			for ( let i = 0, len = chartConfig.data.rows.length; i < len; i++ ) {
				if ( i === 0 ) {
					chartConfig.data.rows[ i ] = [ ...chartConfig.data.rows[ i ], label ];
				} else {
					chartConfig.data.rows[ i ] = [ ...chartConfig.data.rows[ i ], trendCalc.values[ i - 1 ] ];
				}
			}


			// make the trend line always black
			chartConfig.color.pattern = [ ...chartConfig.color.pattern ];

			if ( chartConfig.data.rows[0][0] === '' ) {
				chartConfig.color.pattern[ chartConfig.data.rows[0].length - 2 ] = '#000000';
			} else {
				chartConfig.color.pattern[ chartConfig.data.rows[0].length - 1 ] = '#000000';
			}
		}
	}

	return chartConfig;
}

export function getBlockClassNames( config ) {
	const classNames = [
		'wdg-c3-chart'
	];

	if ( config?.data?.type ) {
		classNames.push( `wdg-c3-chart--${config.data.type}` );

		if ( [ 'line', 'bar', 'area', 'area-spline', 'spline' ].includes( config.data.type ) ) {
			if ( config?.grid?.x?.stroke ) {
				classNames.push( `wdg-c3-chart--x-grid-line-${config.grid.x.stroke}` );
			}

			if ( config?.grid?.y?.stroke ) {
				classNames.push( `wdg-c3-chart--y-grid-line-${config.grid.y.stroke}` );
			}
		}
	}

	return classNames;
}

export const chartTypes = [
	'c3/area-spline',
	'c3/area',
	'c3/bar',
	'c3/donut',
	'c3/line',
	'c3/pie',
	'c3/scatter',
	'c3/spline',
];

export function getBlockTransform( blockType ) {
	return {
		type: 'block',
		blocks: chartTypes.filter( chartType => chartType !== blockType ),
		transform: ( attributes ) => createBlock( blockType, attributes ),
	}
}

/**
 * Mutates the c3.generate config object to add a data
 *
 * @param {object} config the object passed to c3.generate
 * @param {string} col
 * @param {string} type
 * @returns object
 *
 * @see https://github.com/heofs/trendline (inspired by)
 */
export function calcDataTrend( config ) {
	function average( arr ) {
		return sum( arr ) / arr.length;
	}

	function sum( arr ) {
		return arr.reduce( ( sum, val ) => sum + val, 0 );
	}

	let rowIndex;

	if ( ! config.data.rows.length ) {
		return;
	}

	if ( config.trend.col ) {
		rowIndex = config.data.rows[0].indexOf( config.trend.col );
	} else if ( config.data.rows[0].length ) {
		rowIndex = 0;
	}

	if ( rowIndex < 0 ) {
		return null;
	}

	const xData = [ ...Array(config.data.rows.length - 1).keys() ];
	const yData = config.data.rows.slice(1).map( row => parseFloat( row[ rowIndex ] ) );

	// average of X values and Y values
	const xMean = average(xData);
	const yMean = average(yData);

	// Subtract X or Y mean from corresponding axis value
	const xMinusxMean = xData.map( val => val - xMean );
	const yMinusyMean = yData.map( val => val - yMean );

	const xMinusxMeanSq = xMinusxMean.map((val) => Math.pow(val, 2));

	const xy = [];
	for ( let x = 0, len = config.data.rows.length; x < len - 1; x++ ) {
		xy.push( xMinusxMean[x] * yMinusyMean[x] );
	}

	const xySum = sum( xy );

	// b1 is the slope
	const b1 = xySum / sum( xMinusxMeanSq );
	// b0 is the start of the slope on the Y axis
	const b0 = yMean - b1 * xMean;

	const values = [];

	for( let i = 1, len = config.data.rows.length; i < len; i++ ) {
		values.push( b0 + b1 * xData[ i - 1 ] );
	}

	return {
		slope: b1,
		yStart: b0,
		calcY: (x) => b0 + b1 * x,
		values,
	};
}
