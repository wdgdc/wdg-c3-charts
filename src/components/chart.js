import { useSelect } from '@wordpress/data';
import { useEffect, useRef, useState } from '@wordpress/element';
import { Spinner } from '@wordpress/components';
import c3 from 'c3';
import config from '../config.js';
import { parseConfig } from '../helper.js';

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

	useEffect( () => {
		if ( data && data.source_url ) {
			const chartConfig = parseConfig(
				attributes,
				{
					bindto: ref.current,
					data: Object.assign(
						attributes.data,
						{
							type,
							url: data.source_url,
						}
					)
				}
			);

			console.log( chartConfig );

			setChart( c3.generate( chartConfig ) );
		}

		return () => {
			if ( chart && ref.current ) {
				chart.destroy();
				setChart(null);
			}
		}
	}, [
		data,
		ref,
		file,
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
