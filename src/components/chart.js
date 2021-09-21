import { useSelect } from '@wordpress/data';
import { useEffect, useRef, useState } from '@wordpress/element';
import { Spinner } from '@wordpress/components';
import c3 from 'c3';
import config from '../config.js';
import { parseConfig } from '../helper.js';
import { merge } from 'lodash';

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

	console.log( { attributes } );

	useEffect( () => {
		const timeout = setTimeout( () => {
			if ( data && data.source_url ) {
				const chartConfig = parseConfig(
					attributes,
					{
						bindto: ref.current,
						data: merge(
							attributes.data,
							{
								type,
								url: data.source_url,
							}
						)
					}
				);

				console.log( 'chartConfig', chartConfig );

				setChart( c3.generate( chartConfig ) );
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
