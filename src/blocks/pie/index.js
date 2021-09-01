import block from './block.json';
import schema from '../schema.json';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import ChartControl from "../../components/chart-control.js";
import _ from 'lodash';

block.attributes = _.merge( _.cloneDeep( schema ), block.attributes || {} );

block.edit = ( { attributes, setAttributes } ) => {
	return (
		<figure {...useBlockProps( { className: 'c3-chart c3-chart--pie' } ) }>
			<ChartControl
				type="pie"
				attributes={ attributes }
				setAttributes={ setAttributes }
			/>
		</figure>
	)
}

block.save = () => null;

registerBlockType( block.name, block );
