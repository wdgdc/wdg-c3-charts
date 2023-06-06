import c3 from 'c3';
import { useSelect } from '@wordpress/data';
import { useEffect, useRef, useState } from '@wordpress/element';
import { Spinner } from '@wordpress/components';
import { parseConfig } from '../helper.js';
import { isEqual, cloneDeep } from 'lodash';
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
				let rawData = data.c3ChartData.raw;

				const parsedConfig = parseConfig(
					cloneDeep( attributes ),
					{
						bindto: ref.current,
						color: {
							pattern: config.schemes[ type ] || config.color || [],
						},
						data: {
							...attributes.data,
							type,
							[ type === 'scatter' ? 'columns' : 'rows' ]: rawData,
						},
					}
				);

				parsedConfig.axis.fit = false;

				console.log( parsedConfig );

				// special handling for first-column axis
				if ( parsedConfig.axis.x.type === 'first-column' && data.c3ChartData && data.c3ChartData.firstColumn ) {
					parsedConfig.axis.x.type       = 'category';
					parsedConfig.axis.x.categories = data.c3ChartData.firstColumn.slice( 1 );
					parsedConfig.data.rows         = parsedConfig.data.rows.map( row => row.slice( 1 ) );

					delete parsedConfig.data.url;
				}

				if ( localStorage.getItem('c3Debug') ) {
					console.log( parsedConfig );
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
		type,
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
