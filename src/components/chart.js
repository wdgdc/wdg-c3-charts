import c3 from 'c3';
import { useSelect } from '@wordpress/data';
import { useEffect, useRef, useState } from '@wordpress/element';
import { Spinner } from '@wordpress/components';
import { parseConfig } from '../helper.js';
import { isEqual, merge, cloneDeep } from 'lodash';
import config from '../config.js';

export default function Chart( {
	file = 0,
	type,
	attributes,
	setAttributes,
	...props
} ) {
	const data = useSelect( select => select('core').getMedia( file ), [ file ] );
	const ref  = useRef();
	const [ chart, setChart ] = useState(null);
	const [ chartConfig, setChartConfig ] = useState(null);

	useEffect( () => {
		const timeout = setTimeout( () => {
			if ( data && data.source_url ) {
				const parsedConfig = parseConfig(
					cloneDeep( attributes ),
					{
						bindto: ref.current,
						data: merge(
							attributes.data,
							{
								type,
								rows: data.c3ChartData.raw,
							}
						)
					}
				);

				// apply color scheme from global config
				if ( config.schemes && config.schemes[ type ] ) {
					parsedConfig.color = parsedConfig.colors || {};
					parsedConfig.color.pattern = config.schemes[ type ];
				}

				// special handling for first-column axis
				if ( parsedConfig.axis.x.type === 'first-column' && data.c3ChartData && data.c3ChartData.firstColumn ) {
					parsedConfig.axis.x.type       = 'category';
					parsedConfig.axis.x.categories = data.c3ChartData.firstColumn.slice( 1 );
					parsedConfig.data.rows         = parsedConfig.data.rows.map( row => row.slice( 1 ) );

					delete parsedConfig.data.url;
				}

				if ( ! isEqual( chartConfig, parsedConfig ) ) {
					setChartConfig( parsedConfig );
					setChart( c3.generate( parsedConfig ) );
				}
			}
		}, 350 );

		return () => {
			if ( timeout ) {
				clearTimeout( timeout );
			}
		}
	}, [
		data,
		ref.current,
		attributes,
	] );

	if ( ! file ) {
		return null;
	}

	if ( ! data ) {
		return <Spinner />
	}

	return (
		<div ref={ ref } {...props} />
	);
}
