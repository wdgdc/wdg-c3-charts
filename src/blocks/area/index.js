import block from './block.json';
import schema from '../schema.json';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import ChartControl from "../../components/chart-control.js";
import { merge, cloneDeep } from 'lodash';
import save from '../../components/save.js';
import { getBlockTransform } from '../../helper.js';

block.attributes = merge( cloneDeep( schema ), block.attributes || {} );

block.edit = ( { attributes, setAttributes } ) => {
	return (
		<figure {...useBlockProps( { className: 'c3-chart c3-chart--area' } ) }>
			<ChartControl
				type="area"
				attributes={ attributes }
				setAttributes={ setAttributes }
			/>
			<RichText
				tagName="figcaption"
				className="c3-chart__caption"
				value={ attributes.caption }
				onChange={ caption => setAttributes( { caption } ) }
				allowedFormats={ [
					'core/link',
					'core/bold',
					'core/italic',
				] }
				placeholder="Chart caption..."
				keepPlaceholderOnFocus
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
