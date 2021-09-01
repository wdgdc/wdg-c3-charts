import block from './block.json';
import schema from '../schema.json';
import { registerBlockType } from '@wordpress/blocks';
import { InspectorControls, BlockControls, useBlockProps } from '@wordpress/block-editor';
import ChartControl from "../../components/chart-control.js";
import { PanelBody, Toolbar, ToggleControl, Spinner } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import _ from 'lodash';

block.attributes = _.merge( _.cloneDeep( schema ), block.attributes || {} );

block.edit = ( { attributes, setAttributes } ) => {
	const media = useSelect( select => select('core').getMedia( attributes.file ), [ attributes.file ] );

	return (
		<figure {...useBlockProps( { className: 'c3-chart c3-chart--bar' } ) }>
			<ChartControl
				type="bar"
				attributes={ attributes }
				setAttributes={ setAttributes }
				controls={ () => (
					<PanelBody title="Bar Chart" initialOpen icon={ block.icon }>
						{ media ? (
							<ToggleControl
								label="Stacked Bar Chart"
								checked={ attributes.data && attributes.data.groups && attributes.data.groups.length > 0 }
								onChange={ checked => {
									const attr = cloneDeep( attributes );
									attr.data = attr.data || {};
									console.log( { attr } );
									attr.data.groups = checked ? [ media.c3ChartData.headers ] : [];
									setAttributes( attr );
								} }
							/>
						) : <Spinner /> }
					</PanelBody>
				) }

			/>
		</figure>
	);
}

block.save = () => null;

registerBlockType( block.name, block );
