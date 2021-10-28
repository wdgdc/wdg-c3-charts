import c3 from 'c3';
import { parseConfig } from './helper.js';

export function render( node ) {
	let config, nodeConfig = {};

	if ( node.dataset.c3Config ) {
		const c3Root = document.createElement('div');
		node.insertAdjacentElement( 'afterbegin', c3Root );

		try {
			nodeConfig = JSON.parse( node.dataset.c3Config );
		} catch( e ) {
			console.error( 'wdg-c3-charts: Invalid json', node.dataset.c3Config );
			return;
		}

		config = parseConfig(
			nodeConfig,
			{
				bindto: c3Root,
				done: function() {
					console.log( 'done!', node );
				}
			}
		);
	}

 	console.log( 'chart render', node, config.data.type, config );
 	c3.generate(config);
}

document.addEventListener( 'DOMContentLoaded', () => Array.from( document.querySelectorAll( '.wdg-c3-chart' ) ).forEach( render ) );
