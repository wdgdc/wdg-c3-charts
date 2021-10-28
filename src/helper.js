import defaultConfig from './config.js';
import { createBlock } from '@wordpress/blocks';

export function parseConfig( config, custom = {} ) {
	const chartConfig = Object.assign( {}, defaultConfig, config, custom );

	chartConfig.data.axes = chartConfig.data.axes || {};

	if ( chartConfig.axis && chartConfig.axis.y ) {
		if ( chartConfig.axis.y.primary ) {
			chartConfig.data.axes[ chartConfig.axis.y.primary ] = 'y';
		}

		if ( chartConfig.axis.y.secondary ) {
			chartConfig.data.axes[ chartConfig.axis.y.secondary ] = 'y2';
			chartConfig.axis.y2 = { show: true };
		} else {
			chartConfig.axis.y2 = { show: false };
		}
	}

	// ignoring caption
	if ( chartConfig.hasOwnProperty('caption') ) {
		delete chartConfig.caption;
	}

	return chartConfig;
}

export const chartTypes = [
	'c3/area-spline',
	'c3/area',
	'c3/bar',
	'c3/donut',
	'c3/line',
	'c3/pie',
	'c3/spline',
];

export function getBlockTransform( blockType ) {
	return {
		type: 'block',
		blocks: chartTypes.filter( chartType => chartType !== blockType ),
		transform: ( attributes ) => createBlock( blockType, attributes ),
	}
}
