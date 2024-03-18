
import React, { useEffect, useState, useRef } from "react";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Unstable_Popup as Popup } from '@mui/base/Unstable_Popup';
// import { ClickAwayListener } from '@mui/base/ClickAwayListener';


import * as d3 from "d3";
// import { getMainVis } from "./visualization";
import { showAnimation, showAnimationBox } from "./visualization/animation";
import { loadHuBMAPData } from "./dataLoading/dataHuBMAP"; 
import { getPossibleMetadataSelections } from "./visualization/metadata";
import { renderHeatmap } from "./visualization/heatmap";
import { renderTopBar, renderTopViolin } from "./visualization/barTop";
import { renderLeftBar } from "./visualization/barSide";
import { renderGraph } from "./visualization/graph";
import { getTheme } from "./visualization/theme";


export const CellPop = (props) => {
	console.log(props);
	if (!props.data) {
		return <></>;
	}

	const cellPopRef = useRef();
	
	// const [data, setData] = useState(props.data);
	const [theme, setTheme] = useState(props.theme);
	const [dimensions, setDimensions] = useState(props.dimensions);
	const [fraction, setFraction] = useState(false);
	const [metadataField, setMetadataField] = useState("None");

	const [animationAnchor, setAnimationAnchor] = useState(null);

	// get metadata options
	const metadataFields = getPossibleMetadataSelections(props.data);


	// useref for creating the svg
	useEffect(() => {
		const app = d3.select(cellPopRef.current);

		// add svg element
		let svg = app
		.append("svg")
			.attr("width", props.dimensions.global.width)
			.attr("height", props.dimensions.global.height)
		.append("g")
			.attr("class", "main")

		// add background
		svg.append("rect")
			.attr("class", "background")
			.attr("width", props.dimensions.global.width)
			.attr("height", props.dimensions.global.height)
	}, [])

	// call functions on updates
	useEffect(() => {
		let themeColors = getTheme(theme);

		// change background theme
		d3.selectAll(".background").attr("fill", themeColors.background);

		// create main heatmap
		let [x, y, colorRange] = renderHeatmap(props.data, props.dimensions, fraction, themeColors, metadataField);

		// create top barchart
		renderTopBar(props.data, props.dimensions, x, themeColors);

		// create left barchart
		renderLeftBar(props.data, props.dimensions, y, themeColors);
	}, [theme, fraction, metadataField])

	// temp: remove stacked bar when theme change
	useEffect(() => {
		resetStackedBar();
	}, [theme])

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

	function resetStackedBar() {
		d3.selectAll('.bardetail').remove();
	}

	// animation pop-up
	const handleAnimantionPopup = (event) => {
		setAnimationAnchor(animationAnchor ? null : event.currentTarget);
	};

	return (
		<div>
			<Stack spacing={6} direction="row">

				<Button variant="outlined" onClick={resetStackedBar}>Reset stacked bar chart</Button>
			
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

				<Button variant="outlined" onClick={handleAnimantionPopup}>
					Show animation
				</Button>

			</Stack>

			<Popup open={animationAnchor ? true : false} anchor={animationAnchor} placement="bottom-end">
				<div aria-label="Pop up animation" style={{border: 'solid black 2px', backgroundColor: "white"}}>
					<Button variant="outlined" onClick={() => showAnimationBox(props.data, props.dimensions.global.width / 2, props.dimensions.global.height / 2)}>Play animation</Button>
					<div>
						<svg className="animate-svg" width={props.dimensions.global.width / 2} height={props.dimensions.global.height / 2}></svg>
					</div>

				</div>
			</Popup>
				

			{/* <Box sx={{position: 'relative'}}>
				{animationAnchor ? <svg className="animate-svg" width={props.dimensions.global.width / 2} height={props.dimensions.global.height / 2}></svg> : null}
			</Box> */}

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

