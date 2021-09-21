import {
	BlockControls,
	InspectorControls,
	MediaReplaceFlow,
} from '@wordpress/block-editor';

import {
	BaseControl,
	Button,
	Flex,
	FlexBlock,
	FlexItem,
	Icon,
	Panel,
	PanelBody,
	PanelRow,
	SelectControl,
	TextControl,
	ToggleControl,
	Toolbar,
} from '@wordpress/components';

import { useSelect } from '@wordpress/data';
import CSVControl from "./csv-control.js";
import Chart from "./chart.js";
import {
	cloneDeep,
	get,
	merge,
	set,
	unset,
} from 'lodash';

const allowedTypes = [ 'text/csv', 'application/vnd.ms-excel' ];

export default function ChartControl( {
	type,
	attributes,
	setAttributes,
	children,
} ) {
	const media = useSelect( select => select('core').getMedia( attributes.file ), [ attributes.file ] );

	const onCSVSelect = ( file ) => {
		const attrs = cloneDeep( attributes );
		attrs.file = file.id;
		attrs.data = merge( attrs.data || {}, { source_url: file.source_url } );
		setAttributes( attrs );
	}

	const setAttr = ( attr, value ) => {
		const attrs = cloneDeep( attributes );
		set( attrs, attr, value );
		setAttributes( attrs );
	}

	const setAttrs = ( attrMap = {} ) => {
		const attrs = cloneDeep( attributes );
		Object.keys( attrMap ).forEach( attr => set( attrs, attr, attrMap[ attr ] ) );
		setAttributes( attrs );
	}

	const unsetAttr = ( attr ) => {
		const attrs = cloneDeep( attributes );
		unset( attrs, attr );
		setAttributes( attrs );
	}

	const getAttr = ( attr, def = '' ) => {
		return get( attributes, attr, def );
	}

	return (
		<>
			<InspectorControls>
				<Panel>
					<PanelBody title="Data" initialOpen>
						<CSVControl
							value={ getAttr( 'file' ) }
							onSelect={ onCSVSelect }
						/>

						<PanelRow>
							<ToggleControl
								label="Labels"
								checked={ getAttr( 'data.labels', true ) }
								onChange={ labels => setAttr( 'data.labels', labels ) }
							/>
						</PanelRow>
					</PanelBody>

					{ [ 'line' ].includes( type ) && (
						<PanelBody title="Line Chart" initialOpen>
							<ToggleControl
								label="Show Points"
								checked={ getAttr( 'point.show', true ) }
								onChange={ show => setAttr( 'point.show', show ) }
							/>
						</PanelBody>
					) }

					<PanelBody title="Legend" initialOpen={ false }>
						<ToggleControl
							label="Legend"
							checked={ getAttr( 'legend.show', true ) }
							onChange={ show => setAttr( 'legend.show', show ) }
						/>
						<SelectControl
							label="Legend Position"
							value={ getAttr( 'legend.position' ) }
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
							onChange={ position => setAttr( 'legend.position', position ) }
							disabled={ ! getAttr( 'legend.show' ) }
						/>
					</PanelBody>

					<PanelBody title="Tooltip" initialOpen={ false }>
						<ToggleControl
							label="Tooltip"
							checked={ getAttr( 'tooltip.show', true ) }
							onChange={ show => setAttr( 'tooltip.show', show ) }
						/>
						<ToggleControl
							label="Group Tooltip"
							checked={ getAttr( 'tooltip.grouped', false ) }
							onChange={ grouped => setAttr( 'tooltip.grouped', grouped ) }
							disabled={ ! getAttr( 'tooltip.show', true ) }
						/>
					</PanelBody>

					{ [ 'line', 'bar', 'spline', 'area', 'area-spline' ].includes( type ) && (
						<>
							<PanelBody title="X Axis" initialOpen={ false }>
								<ToggleControl
									label="Show"
									checked={ getAttr( 'axis.x.show', true ) }
									onChange={ show => setAttr( 'axis.x.show', show ) }
								/>

								<SelectControl
									label="Type"
									value={ getAttr( 'axis.x.type', 'indexed' ) }
									options={ [
										{ value: 'indexed', label: 'Default' },
										{ value: 'timeseries', label: 'Timeseries' },
										{ value: 'category', label: 'Category' },
									] }
									onChange={ type => {
										const attrs = cloneDeep( attributes );
										attrs.axis.x.type = type;

										if ( type === 'timeseries' ) {
											attrs.axis.x.format = '%Y-%m-%d';
											attrs.data.x = get( media, 'c3ChartData.headers[0]', '' );
										} else {
											delete attrs.axis.x.format;
											delete attrs.data.x;
										}

										setAttributes( attrs );
									} }
									disabled={ ! getAttr( 'axis.x.show', false ) }
								/>

								{ getAttr( 'axis.x.type' ) === 'category' && (
									<BaseControl label="Categories" help="Enter the categories for the X axis labels">
										{ getAttr( 'axis.x.categories', [] ).map( ( category, index ) => (
											<Flex key={ index } align="center">
												<FlexBlock>
													<TextControl
														value={ category }
														onChange={ category => setAttr( `axis.x.categories[${index}]`, category ) }
													/>
												</FlexBlock>
												<FlexItem>
													<Button
														isLink
														isDestructive
														onClick={ () => setAttr( 'axis.x.categories', getAttr( 'axis.x.categories' ).filter( ( cat, catIndex ) => catIndex !== index ) ) }
														style={ { textDecoration: 'none', marginBottom: '8px' } }
													>
														<Icon icon="dismiss" />
													</Button>
												</FlexItem>
											</Flex>
										) ) }

										<PanelRow>
											<Button
												isLink
												onClick={ () => {
													const values = [...getAttr( 'axis.x.categories', [] ) ];
													values.push( '' );
													setAttr( 'axis.x.categories', values );
												} }
											>
												Add Category
											</Button>
										</PanelRow>
									</BaseControl>
								) }

								<TextControl
									label="Label Text"
									value={ getAttr( 'axis.x.label.text', '' ) }
									onChange={ text => setAttr( 'axis.x.label.text', text ) }
								/>

								<SelectControl
									label="Label Position"
									options={ [
										{
											value: 'inner-right',
											label: 'Inner Right',
										},
										{
											value: 'inner-center',
											label: 'Inner Center',
										},
										{
											value: 'inner-left',
											label: 'Inner Left',
										},
										{
											value: 'outer-right',
											label: 'Outer Right',
										},
										{
											value: 'outer-center',
											label: 'Outer Center',
										},
										{
											value: 'outer-left',
											label: 'Outer Left',
										},
									] }
									value={ getAttr( 'axis.x.label.position', 'inner-right' ) }
									onChange={ position => setAttr( 'axis.x.label.position', position ) }
								/>

								<TextControl
									label="Tick Culling"
									help="Set the maximum number of ticks. 0 means all will be shown."
									type="number"
									value={ getAttr( 'axis.x.tick.culling.max', 0 ) }
									onChange={ max => setAttr( 'axis.x.tick.culling.max', max ) }
								/>

								<BaseControl label="Manual Ticks" help="Manually enter the ticks to be shown. They will automatically be placed on the axis based on the available data.">
									{ getAttr( 'axis.x.tick.values', [] ).map( ( value, index ) => (
										<Flex key={ index } align="center">
											<FlexBlock>
												<TextControl
													value={ value }
													onChange={ value => setAttr( `axis.x.tick.values[${index}]`, value ) }
												/>
											</FlexBlock>
											<FlexItem>
												<Button
													isLink
													isDestructive
													onClick={ () => {
														// remove attribute when the last tick as c3 interprets as 0 instead of not defined
														if ( attributes.axis.x.tick.values.length > 1 ) {
															setAttr( 'axis.x.tick.values', attributes.axis.x.tick.values.filter( ( val, valIndex ) => valIndex !== index ) )
														} else {
															unsetAttr( 'axis.x.tick.values' );
														}
													} }
													style={ { textDecoration: 'none', marginBottom: '8px' } }
												>
													<Icon icon="dismiss" />
												</Button>
											</FlexItem>
										</Flex>
									) ) }

									<PanelRow>
										<Button
											isLink
											onClick={ () => {
												const values = [...getAttr( 'axis.x.tick.values', [] ) ];
												values.push( '' );
												setAttr( 'axis.x.tick.values', values );
											} }
										>
											Add Manual Tick Value
										</Button>
									</PanelRow>
								</BaseControl>

								<TextControl
									label="Tick Rotation (Degrees: 0 - 359)"
									type="number"
									min="0"
									max="359"
									value={ getAttr( 'axis.x.tick.rotate') }
									onChange={ rotate => setAttr( 'axis.x.tick.rotate', Math.min( Math.max( rotate, 0 ), 359 ) ) }
								/>

								<ToggleControl
									label="Multiline Tick"
									checked={ getAttr( 'axis.x.tick.multiline', true ) }
									onChange={ multiline => setAttr( 'axis.x.tick.multiline', multiline ) }
								/>
							</PanelBody>

							<PanelBody title="Y Axis" initialOpen={ false }>
								<ToggleControl
									label="Show"
									checked={ getAttr( 'axis.y.show', true ) }
									onChange={ show => setAttr( 'axis.y.show', show ) }
								/>

								<TextControl
									label="Label Text"
									value={ getAttr( 'axis.y.label.text', '' ) }
									onChange={ text => setAttr( 'axis.y.label.text', text ) }
								/>

								<SelectControl
									label="Label Position"
									options={ [
										{
											value: 'inner-top',
											label: 'Inner Top',
										},
										{
											value: 'inner-middle',
											label: 'Inner Middle',
										},
										{
											value: 'inner-bottom',
											label: 'Inner Bottom',
										},
										{
											value: 'outer-top',
											label: 'Outer Top',
										},
										{
											value: 'outer-middle',
											label: 'Outer Middle',
										},
										{
											value: 'outer-bottom',
											label: 'Outer Bottom',
										},
									] }
									value={ getAttr( 'axis.y.label.position', 'inner-top' ) }
									onChange={ position => setAttr( 'axis.y.label.position', position ) }
								/>

								{ media && media.c3ChartData && media.c3ChartData.headers && (
									<>
										<SelectControl
											label="Primary Y Axis"
											value={ getAttr( 'axis.y.primary', '' ) }
											options={ [ { value: '', label: 'Default' } ].concat( media.c3ChartData.headers.map( header => ( { value: header, label: header } ) ) ) }
											onChange={ primary => setAttr( 'axis.y.primary', primary ) }
											disabled={ ! getAttr( 'axis.y.show', true ) }
										/>
										<SelectControl
											label="Secondary Y Axis"
											value={ getAttr( 'axis.y.secondary' ) }
											options={ [ { value: '', label: 'None' } ].concat( media.c3ChartData.headers.map( header => ( { value: header, label: header } ) ) ) }
											onChange={ secondary => setAttr( 'axis.y.secondary', secondary ) }
											disabled={ ! getAttr( 'axis.y.show', true ) }
										/>
									</>
								) }

								<TextControl
									label="Tick Count"
									help="Set the number of y axis ticks. Leave empty to automatically calculate tick values."
									type="number"
									value={ getAttr( 'axis.y.tick.count', 0 ) > 0 ? getAttr( 'axis.y.tick.count' ) : '' }
									onChange={ count => setAttr( 'axis.y.tick.count', Number( count ) ) }
								/>

								<BaseControl label="Manual Ticks" help="Manually enter the ticks to be shown. They will automatically be placed on the axis based on the available data.">
									{ getAttr( 'axis.y.tick.values', [] ).map( ( value, index ) => (
										<Flex key={ index } align="center">
											<FlexBlock>
												<TextControl
													value={ value }
													onChange={ value => setAttr( `axis.y.tick.values[${index}]`, value ) }
												/>
											</FlexBlock>
											<FlexItem>
												<Button
													isLink
													isDestructive
													onClick={ () => {
														// remove attribute when the last tick as c3 interprets as 0 instead of not defined
														if ( attributes.axis.y.tick.values.length > 1 ) {
															setAttr( 'axis.y.tick.values', attributes.axis.y.tick.values.filter( ( val, valIndex ) => valIndex !== index ) )
														} else {
															unsetAttr( 'axis.y.tick.values' );
														}
													} }
													style={ { textDecoration: 'none', marginBottom: '8px' } }
												>
													<Icon icon="dismiss" />
												</Button>
											</FlexItem>
										</Flex>
									) ) }

									<PanelRow>
										<Button
											isLink
											onClick={ () => {
												const values = [...getAttr( 'axis.y.tick.values', [] ) ];
												values.push( '' );
												setAttr( 'axis.y.tick.values', values );
											} }
										>
											Add Manual Tick Value
										</Button>
									</PanelRow>
								</BaseControl>
							</PanelBody>
						</>
					) }

					{ [ 'line', 'bar', 'area', 'area-spline', 'spline' ].includes( type ) && (
						<PanelBody title="Grid" initialOpen={ false }>
							<PanelRow>
								<ToggleControl
									label="Show X Axis Grid"
									checked={ getAttr( 'grid.x.show', false ) }
									onChange={ show => setAttr( 'grid.x.show', show ) }
								/>
							</PanelRow>

							{ getAttr( 'grid.x.lines', [] ).length ?
								getAttr( 'grid.x.lines' ).map( ( line, index ) => (
									<div key={ index }>
										<TextControl
											label="Line Value"
											value={ line.value }
											onChange={ value => setAttr( `grid.x.lines[${index}].value`, value ) }
										/>
										<TextControl
											label="Line Label"
											value={ line.text }
											onChange={ text => setAttr( `grid.x.lines[${index}].text`, text ) }
										/>
										<SelectControl
											label="Label Position"
											value={ line.position }
											onChange={ position => setAttr( `grid.x.lines[${index}].position`, position ) }
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
											onClick={ () => setAttr( 'grid.x.lines', attributes.grid.x.lines.filter( ( line, lineIndex ) => lineIndex !== index ) ) }
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
										const lines = [...attributes.grid.x.lines];
										lines.push( {
											value: 0,
											text: 'Grid Line',
											position: ''
										} );
										setAttr( 'grid.x.lines', lines );
									} }
								>
									Add X Grid Line
								</Button>
							</PanelRow>

							<PanelRow>
								<ToggleControl
									label="Show Gridline Y Axis"
									checked={ getAttr( 'grid.y.show', false ) }
									onChange={ show => setAttr( 'grid.y.show', show ) }
								/>
							</PanelRow>

							{ getAttr( 'grid.y.lines', [] ).length ?
								getAttr( 'grid.y.lines' ).map( ( line, index ) => (
									<div key={ index }>
										<TextControl
											label="Line Value"
											value={ line.value }
											onChange={ value => setAttr( `grid.y.lines[${index}].value`, value ) }
										/>
										<TextControl
											label="Line Label"
											value={ line.text }
											onChange={ value => setAttr( `grid.y.lines[${index}].text`, value ) }
										/>
										<SelectControl
											label="Label Position"
											value={ line.position }
											onChange={ position => setAttr( `grid.x.lines[${index}].position`, position ) }
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
											onClick={ () => setAttr( 'grid.y.lines', attributes.grid.y.lines.filter( ( line, lineIndex ) => lineIndex !== index ) ) }
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
										const lines = [...attributes.grid.y.lines];
										lines.push( {
											value: 0,
											text: 'Grid Line',
											position: ''
										} );
										setAttr( 'grid.y.lines', lines );
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
										onChange={ value => setAttr( `regions[${index}].axis`, value ) }
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
												disabled: ! getAttr( 'axis.y.secondary', false ),
											},
										] }
									/>
									<TextControl
										label="Start"
										value={ region.start }
										onChange={ start => setAttr( `regions[${index}].start`, start ) }
									/>
									<TextControl
										label="End"
										value={ region.end }
										onChange={ end => setAttr( `regions[${index}].end`, end ) }
									/>
									<Button
										isLink
										isDestructive
										onClick={ () => setAttr( 'regions', attributes.regions.filter( r, regionIndex => regionIndex !== index ) ) }
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
										const regions = [...attributes.regions];
										regions.push( {
											axis: 'x',
											start: 0,
											end: 10,
											class: '',
										} );
										setAttr( 'regions', regions );
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
							onChange={ zoom => setAttr( 'zoom', zoom ) }
						/>
						<ToggleControl
							label="Sub Chart"
							checked={ attributes.subchart }
							onChange={ subchart => setAttr( 'subchart', subchart ) }
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
