import { RichText } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	if ( attributes.caption ) {
		return (
			<RichText.Content
				tagName="figcaption"
				className="c3-chart__caption"
				value={ attributes.caption }
			/>
		);
	}

	return null;
};
