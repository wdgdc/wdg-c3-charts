import c3 from 'c3';
import { parseConfig } from './helper.js';

export function render( node ) {
	let config, nodeConfig = {};

	if ( node.dataset.c3Config ) {
		try {
			nodeConfig = JSON.parse( node.dataset.c3Config );
		} catch( e ) {
			console.error( 'wdg chart: Invalid json' );
			return;
		}

		config = parseConfig(
			nodeConfig,
			{
				bindto: node,
			}
		);
	}

 	console.log( 'chart render', node, config.data.type, config );
 	c3.generate(config);
}

document.addEventListener( 'DOMContentLoaded', () => Array.from( document.querySelectorAll( '.c3-chart' ) ).forEach( render ) );
