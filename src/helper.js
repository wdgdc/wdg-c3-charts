import defaultConfig from './config.js';

export function parseConfig( config, custom = {} ) {
	const chartConfig = Object.assign( defaultConfig, config, custom );
	// console.log( 1, {chartConfig} );

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

	// console.log( 2, {chartConfig} );

	return chartConfig;
}
