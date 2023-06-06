import block from './block.json';
import schema from '../schema.json';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import ChartControl from "../../components/chart-control.js";
import { merge, cloneDeep } from 'lodash';
import save from '../../components/save.js';
import { getBlockTransform, getBlockClassNames } from '../../helper.js';

block.attributes = merge( cloneDeep( schema ), block.attributes || {} );

block.edit = ( { attributes, setAttributes, isSelected } ) => {
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
				type="spline"
				attributes={ attributes }
				setAttributes={ setAttributes }
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
