import { BaseControl, Button, Spinner } from '@wordpress/components';
import { MediaUpload, MediaUploadCheck, MediaPlaceholder } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

export default function CSVControl( {
	accept = "text/csv", // pass false to accept all types
	addToGallery = false,
	allowedTypes = [ "text/csv" ], // pass null to allow all types
	help,
	label,
	labels = { title: 'Select CSV File', instructions: '' },
	onSelect,
	removeMediaLabel = 'Remove CSV File',
	value,
	multiple = false,
} ) {
	const media = useSelect( select => select('core').getMedia( value ), [ value ] );

	return (
		<BaseControl label={ label } help={ help }>
			<div className="wikit-charts-csv-control">
				{ value ? (
					<MediaUploadCheck>
						<MediaUpload
							allowedTypes={ allowedTypes }
							value={ value }
							onSelect={ media => onSelect( media ) }
							render={ ( { open } ) => (
								<>
									<Button
										onClick={ open }
										icon="media-spreadsheet"
										isSecondary
										isBusy={ value && ! media }
										style={ {
											width         : '100%',
											justifyContent: 'flex-start',
											overflow      : 'hidden',
										} }
									>
										{ media ? media.source_url.split('/').pop() : <Spinner /> }
									</Button>
								</>
							) }
						/>
					</MediaUploadCheck>
				) : (
					<MediaUploadCheck fallback="You do not have the upload media capability.">
						<MediaPlaceholder
							accept={ accept }
							addToGallery={ addToGallery }
							allowedTypes={ allowedTypes }
							labels={ labels }
							onSelect={ media => onSelect( media ) }
							multiple={ multiple }
						/>
					</MediaUploadCheck>
				) }
			</div>
		</BaseControl>
	)
}
