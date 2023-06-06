import block from './block.json';
import schema from '../schema.json';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import ChartControl from "../../components/chart-control.js";
import { PanelBody, ToggleControl, Spinner } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import _ from 'lodash';
import save from '../../components/save.js';
import { getBlockTransform, getBlockClassNames } from '../../helper.js';

block.attributes = _.merge( _.cloneDeep( schema ), block.attributes || {} );

block.edit = ( { attributes, setAttributes, isSelected } ) => {
	const media = useSelect( select => select('core').getMedia( attributes.file ), [ attributes.file ] );

	return (
		<figure {...useBlockProps( { className: getBlockClassNames( attributes ).join( ' ' ) } ) }>
			{ ( attributes.chartLabel || attributes.chartLabel2 || isSelected ) && (
				<div className="wdg-c3-chart__labels">
					{ ( attributes.chartLabel || isSelected ) && (
						<RichText
							tagName="p"
							className="wdg-c3-chart__label wdg-c3-chart__label--1"
							value={ attributes.chartLabel }
							onChange={ chartLabel => setAttributes( { chartLabel } ) }
							allowedFormats={ [] }
							placeholder="Y Axis Label..."
						/>
					) }
					{ ( attributes.chartLabel2 || isSelected ) && (
						<RichText
							tagName="p"
							className="wdg-c3-chart__label wdg-c3-chart__label--2"
							value={ attributes.chartLabel2 }
							onChange={ chartLabel2 => setAttributes( { chartLabel2 } ) }
							allowedFormats={ [] }
							placeholder="Y2 Axis Label..."
						/>
					) }
				</div>
			) }
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
									attr.data.groups = checked ? [ media.c3ChartData.headers ] : [];
									setAttributes( attr );
								} }
							/>
						) : <Spinner /> }
					</PanelBody>
				) }
			/>
			<RichText
				tagName="figcaption"
				className="wdg-c3-chart__caption"
				value={ attributes.caption }
				onChange={ caption => setAttributes( { caption } ) }
				allowedFormats={ [
					'core/link',
					'core/bold',
					'core/italic',
				] }
				placeholder="Chart caption..."
			/>
		</figure>
	);
}

block.save = save;

block.transforms = {
	from: [
		getBlockTransform( block.name ),
	],
}

registerBlockType( block.name, block );
