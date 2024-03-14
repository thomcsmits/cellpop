
import React, { useEffect, useState, useRef } from "react";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import * as d3 from "d3";
import { getMainVis } from "./visualization";
// import { showAnimation } from "./src/visualization/animation";
import { loadHuBMAPData } from "./dataLoading/dataHuBMAP"; 
import { getPossibleMetadataSelections } from "./visualization/metadata";
import { renderHeatmap } from "./visualization/heatmap";
import { renderTopBar, renderTopViolin } from "./visualization/barTop";
import { renderLeftBar } from "./visualization/barSide";
import { renderGraph } from "./visualization/graph";


export const CellPop = (props) => {
	console.log(props);
	if (!props.data) {
		return <></>;
	}

	const cellPopRef = useRef();

	const [theme, setTheme] = useState(props.theme);
	const [dimensions, setDimensions] = useState(props.dimensions);
	const [fraction, setFraction] = useState(false);
	const [metadataField, setMetadataField] = useState("None");

	// get metadata options
	const metadataFields = getPossibleMetadataSelections(props.data);


	// useref for creating the svg
	useEffect(() => {
		const app = d3.select(cellPopRef.current);

		// add svg element
		let svg = app
		.append("svg")
			.attr("width", 1000)
			.attr("height", 1000)
		.append("g")
			.attr("class", "main")

		// create main heatmap
		console.log('smth', props.data)
		let [x, y, colorRange] = renderHeatmap(svg, props.data, dimensions, false, theme)

		// create top barchart
		renderTopBar(svg, props.data, dimensions, x)

		// // create left barchart
		renderLeftBar(svg, props.data, dimensions, y)
		
	}, [])



	// resizing hooks


	// call function that wraps the renderXXX
		// getMainVis(props.data);
	

	// create MUI buttons with callback functions to e.g. change theme
	function changeTheme(event, newTheme) {
		if (newTheme !== null) {
			setTheme(newTheme);
		}
	}

	function changeFraction(event, newFraction) {
		if (newFraction !== null) {
			setFraction(newFraction);
		}
	}

	function changeMetadataField(event) {
		setMetadataField(event.target.value);
	}
	
	return (
		<div>
			<ToggleButtonGroup
				color="primary"
				value={fraction}
				exclusive
				onChange={changeFraction}
				aria-label="Fraction"
			>
				<ToggleButton value={false}>Count</ToggleButton>
				<ToggleButton value={true}>Fraction</ToggleButton>
			</ToggleButtonGroup>
			
			<FormControl sx={{ m: 1, width: 300 }}>
				<InputLabel id="sort-by-metadata">Sort by metadata</InputLabel>
				<Select
					labelId="demo-simple-select-label"
					id="demo-simple-select"
					value={metadataField}
					label="select-metadata"
					onChange={changeMetadataField}
				>
					<MenuItem value="None" key="None">None</MenuItem>
					{metadataFields.map(d => {
						return <MenuItem value={d[0]} key={d[0]}>{d[0]}</MenuItem>
					})}
				</Select>
			</FormControl>

			<ToggleButtonGroup
				color="primary"
				value={theme}
				exclusive
				onChange={changeTheme}
				aria-label="Theme"
			>
				<ToggleButton value="light">Light</ToggleButton>
				<ToggleButton value="dark">Dark</ToggleButton>
			</ToggleButtonGroup>

			<div id='cellpopvis' ref={cellPopRef}></div>

		</div>
	)
}

// loadHuBMAPData(uuids).then((data) => {
// 	console.log('data', data);
// 	getMainVis(data);
// }).catch(error => {
// 	console.error(error);
// });


// export function CellPop(data) {
// 	getMainVis(data);
// }

