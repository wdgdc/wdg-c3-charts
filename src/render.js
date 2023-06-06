import c3 from 'c3';
import { parseConfig, getBlockClassNames } from './helper.js';

/**
 * Adds css style inline so exporting to canvas understands them
 *
 * @param {SVGElement} node
 * @return undefined
 */
export function applyStylesInline( node ) {
	const cs       = getComputedStyle(node);
	const propsMap = {
		text: [
			'color',
			'fill',
			'fontSize',
			'fontFamily',
		],
		default: [
			'backgroundColor',
			'color',
			'display',
			'fill',
			'opacity',
			'shapeRendering',
			'stroke',
			'strokeDasharray',
			'strokeDashoffset',
			'strokeOpacity',
			'strokeWidth',
			'visibility',
		]
	};

	const props = propsMap[ node.tagName.toLowerCase() ] || propsMap.default;

	props.forEach( prop => {
		if ( cs[ prop ] ) {
			node.style[ prop ] = cs[ prop ];
		}
	} );
}

/**
 * Generate a data URI of a svg as an image
 *
 * @param {SVGElement} svgElement the SVG to generate a data uri for
 * @param {string} mimeType the mime type of the image (png, jpeg, webp)
 * @param {string} fillStyle background color
 * @returns {Promise}
 */
export function generateExport( svgElement, mimeType = 'image/png', fillStyle = '#ffffff' ) {
	return new Promise( ( resolve, reject ) => {
		if ( ! svgElement instanceof SVGElement ) {
			return reject( new Error( 'SVGElement is required' ) );
		}

		if ( ! mimeType.match( /^image\// ) ) {
			return reject( new Error( `Invalid mime type: ${mimeType}`) );
		}

		const { height, width } = svgElement.getBoundingClientRect();
		const svgClone          = svgElement.cloneNode(true);
		const svgWrap           = document.createElement('div');

		svgWrap.style.position      = 'absolute';
		svgWrap.style.overflow      = 'hidden';
		svgWrap.style.pointerEvents = 'none';
		svgWrap.style.userSelect    = 'none';
		svgWrap.style.height        = '1px';
		svgWrap.style.width         = '1px';

		// cloned.style.position        = 'absolute';
		svgClone.style.backgroundColor = '#fff';
		svgClone.setAttribute('height', `${height * 2}px`);
		svgClone.setAttribute('width', `${width * 2}px`);
		svgClone.setAttribute('viewBox', `0 0 ${width} ${height}`);

		svgElement.parentNode.insertBefore(svgWrap, svgElement);
		svgWrap.appendChild(svgClone);

		svgClone.querySelectorAll('path,text,circle,g,line,text').forEach(applyStylesInline);

		const svgString = new XMLSerializer().serializeToString(svgClone);
		const image     = new Image();
		const canvas    = document.createElement('canvas');
		const context   = canvas.getContext('2d');

		canvas.width  = width * 2;
		canvas.height = height * 2;

		image.onload = () => {
			context.fillStyle = fillStyle;
			context.drawImage(image, 0, 0);
			resolve(canvas.toDataURL(mimeType));
			svgWrap.parentNode.removeChild(svgWrap);
		}
		image.onerror = reject;
		image.src = `data:image/svg+xml; charset=utf8, ${encodeURIComponent(svgString)}`;
	} );
}

/**
 *
 * @param {SVGElement} svg the SVG node to create the link for
 * @param {string} text the text of the link
 * @param {string} name name of the file to download
 * @returns HTMLAnchorElement
 */
export function createDownloadLink( svg, text = 'Download chart', name = 'chart.png' ) {
	const link = document.createElement('a');
	link.classList.add('wdg-c3-charts__export');
	link.download  = name;
	link.innerText = text;

	// always generate a new svg on click with a slight delay so we don't get stuck mid animation
	link.onclick = (e) => {
		e.preventDefault();

		setTimeout( () => {
			generateExport( svg ).then( href => {
				const dl = document.createElement('a');
				dl.download = link.download;
				dl.href = href;
				dl.click();
			} );
		}, 200 );
	};

	return link;
}

/**
 *
 * @param {HTMLFigureElement} node the figure element that contains c3 configuration in data-c3-config
 * @returns c3
 */
export function render( node ) {
	let   config     = {};
	const configNode = node.querySelector('script[type="application/json"]');
	const c3Root     = document.createElement('div');

	if ( configNode ) {
		try {
			config = JSON.parse( configNode.textContent );
		} catch( e ) {
			console.error( 'wdg-c3-charts: Invalid json', configNode.textContent );
			return;
		}

		configNode.insertAdjacentElement( 'afterend', c3Root );

		config = parseConfig(
			config,
			{
				bindto: c3Root,
			}
		);

		const classNames = getBlockClassNames( config );

		if ( classNames.length ) {
			classNames.forEach( className => node.classList.add( className ) );
		}

		if ( true || config.download ) {
			let link, svg;
			const wrap = document.createElement('p');
			wrap.classList.add('wdg-c3-charts__export-wrap');

			config.oninit = () => {
				svg = node.querySelector('svg');
				link = createDownloadLink(svg, config.downloadText || 'Download chart', config.downloadName || 'chart');
				node.insertAdjacentElement('afterend', wrap);
				wrap.appendChild(link);
			};

			config.onrendered = () => {
				generateExport(svg).then(href => link.href = href).catch(fault => console.error(fault.message));
			}
		}
	}

 	return c3.generate(config);
}

export let charts;

document.addEventListener( 'DOMContentLoaded', () => {
	charts = Array.from( document.querySelectorAll( '.wdg-c3-chart' ) ).map( render );
} );
