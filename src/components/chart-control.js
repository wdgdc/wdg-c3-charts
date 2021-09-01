import { InspectorControls, BlockControls, MediaReplaceFlow } from '@wordpress/block-editor';
import { Panel, PanelBody, PanelRow, Toolbar, ToggleControl, SelectControl, Button, TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import CSVControl from "./csv-control.js";
import Chart from "./chart.js";
import _ from 'lodash';

const allowedTypes = [ 'text/csv', 'application/vnd.ms-excel' ];

export default function ChartControl( {
	type,
	attributes,
	setAttributes,
	children,
} ) {
	const media = useSelect( select => select('core').getMedia( attributes.file ), [ attributes.file ] );

	const onCSVSelect = ( file ) => {
		const attrs = _.cloneDeep( attributes );
		attrs.file = file.id;
		attrs.data = _.merge( attrs.data || {}, { source_url: file.source_url } );
		setAttributes( attrs );
	}

	return (
		<>
			<InspectorControls>
				<Panel>
					<PanelBody title="Data" initialOpen>
						<CSVControl
							value={ attributes.file }
							onSelect={ onCSVSelect }
						/>

						<PanelRow>
							<ToggleControl
								label="Labels"
								checked={ attributes.data.labels }
								onChange={ labels => {
									const attrs = _.cloneDeep( attributes );
									attrs.data.labels = labels;
									setAttributes( attrs );
								} }
							/>
						</PanelRow>
					</PanelBody>

					{ [ 'line' ].includes( type ) && (
						<PanelBody title="Line Chart" initialOpen>
							<ToggleControl
								label="Show Points"
								checked={ attributes.point.show }
								onChange={ show => {
									const attr = _.cloneDeep( attributes );
									attr.point.show = show;
									setAttributes( attr );
								} }
							/>
						</PanelBody>
					) }

					<PanelBody title="Legend" initialOpen={ false }>
						<ToggleControl
							label="Legend"
							checked={ attributes.legend.show }
							onChange={ show => {
								const attrs = _.cloneDeep( attributes );
								attrs.legend.show = show;
								setAttributes( attrs );
							} }
						/>
						<SelectControl
							label="Legend Position"
							value={ attributes.legend.position }
							options={ [
								{
									label: 'Bottom',
									value: 'bottom',
								},
								{
									label: 'Right',
									value: 'right',
								},
							] }
							onChange={ position => {
								const attrs = _.cloneDeep( attributes );
								attrs.legend.position = position;
								setAttributes( attrs )
							} }
							disabled={ ! attributes.legend.show }
						/>
					</PanelBody>

					<PanelBody title="Tooltip" initialOpen={ false }>
						<ToggleControl
							label="Tooltip"
							checked={ attributes.tooltip.show }
							onChange={ show => {
								const attrs = _.cloneDeep( attributes );
								attrs.tooltip.show = show;
								setAttributes( attrs );
							} }
						/>
						<ToggleControl
							label="Group Tooltip"
							checked={ attributes.tooltip.grouped }
							onChange={ grouped => {
								const attrs = _.cloneDeep( attributes );
								attrs.tooltip.grouped = grouped;
								setAttributes( attrs );
							} }
							disabled={ ! attributes.tooltip.show }
						/>
					</PanelBody>

					{ [ 'line', 'bar', 'spline', 'area', 'area-spline' ].includes( type ) && (
						<PanelBody title="Axis" initialOpen={ false }>
							<ToggleControl
								label="X Axis"
								checked={ attributes.axis.x.show }
								onChange={ show => {
									let attrs = _.cloneDeep( attributes );
									attrs.axis.x.show = show;
									setAttributes( attrs );
								} }
							/>

							<SelectControl
								label="X Axis Type"
								value={ attributes.axis.x.type }
								options={ [
									{ value: 'indexed', label: 'Default' },
									{ value: 'timeseries', label: 'Timeseries' },
									// { value: 'indexed', label: 'Default' },
								] }
								onChange={ type => {
									let attrs = _.cloneDeep( attributes );

									attrs.axis.x.type = type;

									if ( type === 'timeseries' ) {
										attrs.axis.tick.format = '%Y-%m-%d';
									} else {
										delete attrs.axis.tick.format;
									}
									setAttributes( attrs );
								} }
								disabled={ ! attributes.axis.x.show }
							/>

							<ToggleControl
								label="Y Axis"
								checked={ attributes.axis.y.show }
								onChange={ show => {
									let attrs = _.cloneDeep( attributes );
									attrs.axis.y.show = show;
									setAttributes( attrs );
								} }
							/>

							{ media && media.c3ChartData && media.c3ChartData.headers && (
								<>
									<SelectControl
										label="Primary Y Axis"
										value={ attributes.axis.y.primary }
										options={ [ { value: '', label: 'Default' } ].concat( media.c3ChartData.headers.map( header => ( { value: header, label: header } ) ) ) }
										onChange={ primary => {
											let attrs = _.cloneDeep( attributes );
											attrs.axis.y.primary = primary;
											setAttributes( attrs );
										} }
										disabled={ ! attributes.axis.y.show }
									/>
									<SelectControl
										label="Secondary Y Axis"
										value={ attributes.axis.y.secondary }
										options={ [ { value: '', label: 'None' } ].concat( media.c3ChartData.headers.map( header => ( { value: header, label: header } ) ) ) }
										onChange={ secondary => {
											let attrs = _.cloneDeep( attributes );
											attrs.axis.y.secondary = secondary;
											setAttributes( attrs );
										} }
										disabled={ ! attributes.axis.y.show }
									/>
								</>
							) }
						</PanelBody>
					) }

					{ [ 'line', 'bar', 'area', 'area-spline', 'spline' ].includes( type ) && (
						<PanelBody title="Grid" initialOpen={ false }>
							<PanelRow>
								<ToggleControl
									label="Show X Axis Grid"
									checked={ attributes.grid.x.show }
									onChange={ show => {
										let attrs = _.cloneDeep( attributes );
										attrs.grid.x.show = show;
										setAttributes( attrs );
									} }
								/>
							</PanelRow>

							{ attributes.grid.x && attributes.grid.x.lines && attributes.grid.x.lines.length ?
								attributes.grid.x.lines.map( ( line, index ) => (
									<div key={ index }>
										<TextControl
											label="Line Value"
											value={ line.value }
											onChange={ value => {
												let attrs = _.cloneDeep( attributes );
												attrs.grid.x.lines[ index ].value = value;
												setAttributes( attrs );
											} }
										/>
										<TextControl
											label="Line Label"
											value={ line.text }
											onChange={ text => {
												let attrs = _.cloneDeep( attributes );
												attrs.grid.x.lines[ index ].text = text;
												setAttributes( attrs );
											} }
										/>
										<SelectControl
											label="Label Position"
											value={ line.position }
											onChange={ position => {
												let attrs = _.cloneDeep( attributes );
												attrs.grid.x.lines[ index ].position = position;
												setAttributes( attrs );
											} }
											options={ [
												{
													value: '',
													label: 'End',
												},
												{
													value: 'middle',
													label: 'Middle',
												},
												{
													value: 'start',
													label: 'Start',
												},
											] }
										/>
										<Button
											isLink
											isDestructive
											onClick={ () => {
												let attrs = _.cloneDeep( attributes );
												attrs.grid.x.lines = attrs.grid.x.lines.filter( ( line, lineIndex ) => lineIndex !== index );
												setAttributes( attrs );
											} }
										>
											Remove Grid Line
										</Button>

										<hr />
									</div>
								) ) : null
							}

							<PanelRow>
								<Button
									isLink
									onClick={ () => {
										let attrs = _.cloneDeep( attributes );
										attrs.grid.x.lines.push( {
											value: 0,
											text: 'Grid Line',
											position: ''
										} );
										setAttributes( attrs );
									} }
								>
									Add X Grid Line
								</Button>
							</PanelRow>

							<PanelRow>
								<ToggleControl
									label="Show Gridline Y Axis"
									checked={ attributes.grid.y.show }
									onChange={ show => {
										let attrs = _.cloneDeep( attributes );
										attrs.grid.y.show = show;
										setAttributes( attrs );
									} }
								/>
							</PanelRow>

							{ attributes.grid.y && attributes.grid.y.lines && attributes.grid.y.lines.length ?
								attributes.grid.y.lines.map( ( line, index ) => (
									<div key={ index }>
										<TextControl
											label="Line Value"
											value={ line.value }
											onChange={ value => {
												let attrs = _.cloneDeep( attributes );
												attrs.grid.y.lines[ index ].value = value;
												setAttributes( attrs );
											} }
										/>
										<TextControl
											label="Line Label"
											value={ line.text }
											onChange={ text => {
												let attrs = _.cloneDeep( attributes );
												attrs.grid.y.lines[ index ].text = text;
												setAttributes( attrs );
											} }
										/>
										<SelectControl
											label="Label Position"
											value={ line.position }
											onChange={ position => {
												let attrs = _.cloneDeep( attributes );
												attrs.grid.y.lines[ index ].position = position;
												setAttributes( attrs );
											} }
											options={ [
												{
													value: '',
													label: 'End',
												},
												{
													value: 'middle',
													label: 'Middle',
												},
												{
													value: 'start',
													label: 'Start',
												},
											] }
										/>
										<Button
											isLink
											isDestructive
											onClick={ () => {
												let attrs = _.cloneDeep( attributes );
												attrs.grid.y.lines = attrs.grid.y.lines.filter( ( line, lineIndex ) => lineIndex !== index );
												setAttributes( attrs );
											} }
										>
											Remove Grid Line
										</Button>

										<hr />
									</div>
								) ) : null
							}

							<PanelRow>
								<Button
									isLink
									onClick={ () => {
										let attrs = _.cloneDeep( attributes );
										attrs.grid.y.lines.push( {
											value: 0,
											text: 'Grid Line',
											position: ''
										} );
										setAttributes( attrs );
									} }
								>
									Add Y Grid Line
								</Button>
							</PanelRow>
						</PanelBody>
					) }

					{ [ 'line', 'bar', 'area', 'area-spline', 'spline' ].includes( type ) && (
						<PanelBody title="Regions" initialOpen={ false }>
							{ attributes.regions && attributes.regions.map( ( region, index ) => (
								<div key={ index }>
									<SelectControl
										label="Axis"
										value={ region.axis }
										onChange={ value => {
											let attrs = _.cloneDeep( attributes );
											attrs.regions[ index ].axis = value;
											setAttributes( attrs );
										} }
										options={ [
											{
												value: 'x',
												label: 'X Axis',
											},
											{
												value: 'y',
												label: 'Y Axis',
											},
											{
												value: 'y2',
												label: 'Secondary Y Axis',
												disabled: ! attributes.axis.y.secondary
											},
										] }
									/>
									<TextControl
										label="Start"
										value={ region.start }
										onChange={ start => {
											let attrs = _.cloneDeep( attributes );
											attrs.regions[ index ].start = start;
											setAttributes( attrs );
										} }
									/>
									<TextControl
										label="End"
										value={ region.end }
										onChange={ end => {
											let attrs = _.cloneDeep( attributes );
											attrs.regions[ index ].end = end;
											setAttributes( attrs );
										} }
									/>
									<Button
										isLink
										isDestructive
										onClick={ () => {
											let attrs = _.cloneDeep( attributes );
											attrs.regions = attrs.regions.filter( ( r, regionIndex ) => regionIndex !== index );
											setAttributes( attrs );
										} }
									>
										Remove Region
									</Button>

									<hr />
								</div>
							) ) }

							<PanelRow>
								<Button
									isLink
									onClick={ () => {
										let attrs = _.cloneDeep( attributes );
										attrs.regions.push( {
											axis: 'x',
											start: 0,
											end: 10,
											class: '',
										} );
										setAttributes( attrs );
									} }
								>
									Add Region
								</Button>
							</PanelRow>
						</PanelBody>
					) }

					<PanelBody title="Experimental" initialOpen={ false }>
						<ToggleControl
							label="Zoom Enabled"
							checked={ attributes.zoom }
							onChange={ zoom => setAttributes( { zoom } ) }
						/>
						<ToggleControl
							label="Sub Chart"
							checked={ attributes.subchart }
							onChange={ subchart => setAttributes( { subchart } ) }
						/>
					</PanelBody>
				</Panel>
			</InspectorControls>

			<BlockControls>
				<Toolbar>
					<MediaReplaceFlow
						media={ media && media.source_url ? media.source_url : '' }
						mediaId={ attributes.file }
						allowedTypes={ allowedTypes }
						accept={ allowedTypes.join(',') }
						onSelect={ onCSVSelect }
						name={ attributes.file ? 'Replace CSV Data File' : 'Select CSV Data File' }
					/>
				</Toolbar>
			</BlockControls>

			{ attributes.file ? (
				children ? (
					children
				) : (
					<Chart
						type={ type }
						file={ attributes.file }
						attributes={ attributes }
						setAttributes={ setAttributes }
					/>
				)
			) : (
				<CSVControl
					value={ attributes.file }
					onSelect={ onCSVSelect }
				/>
			) }
		</>
	);
}
