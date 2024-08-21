import React, { useEffect, useState, useRef } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { Unstable_Popup as Popup } from "@mui/base/Unstable_Popup";
// import { ClickAwayListener } from "@mui/base/ClickAwayListener";

import * as d3 from "d3";
import { renderCellPopVisualization } from "./visualization";
import { showAnimationBox } from "./visualization/animation";
import { getPossibleMetadataSelections } from "./visualization/metadata";
import { getTheme } from "./visualization/theme";
import { resetRowNames } from "./dataLoading/dataWrangling";
import { resetExtensionChart } from "./visualization/barExtensions";
import { drawSizeBoundaries, removeSizeBoundaries } from "./visualization/size";
import { CellPopProps, CellPopDimensions, CellPopTheme, CellPopData } from "./cellpop-schema";


export const CellPop = (props: CellPopProps) => {
	if (!props.data) {
		return <></>;
	}

	const cellPopRef = useRef<HTMLDivElement>(null);

	// const [data, setData] = useState(props.data);
	const [theme, setTheme] = useState<CellPopTheme>(props.theme);
	const [dimensions, setDimensions] = useState<CellPopDimensions>(props.dimensions);
	const [fraction, setFraction] = useState<boolean>(false);
	const [metadataField, setMetadataField] = useState<string>("None");

	const [animationAnchor, setAnimationAnchor] = useState<HTMLElement>(null);
	const [boundary, setBoundary] = useState<boolean>(false);

	// get metadata options
	const metadataFields = getPossibleMetadataSelections(props.data);


	// useref for creating the svg
	useEffect(() => {
		const app = d3.select(cellPopRef.current);

		// on the first render, we want to make sure there aren't any svg's
		app.selectAll("svg").remove();

		// add svg element for main
		const svg = app.append("svg")
			.attr("width", props.dimensions.global.width.total)
			.attr("height", props.dimensions.global.height.total)
		.append("g")
			.attr("class", "main");

		// add background
		svg.append("rect")
			.attr("class", "background")
			.attr("width", props.dimensions.global.width.total)
			.attr("height", props.dimensions.global.height.total);

		// add svg element for extension
		const svgExtension = app.append("svg")
			.attr("class", "extension");
	}, []);

	// call renderCellPopVisualization on updates
	useEffect(() => {
		// get theme colors
		const themeColors = getTheme(theme);

		// change background theme
		d3.selectAll(".background").style("fill", themeColors.background);

		// create main visualization
		renderCellPopVisualization(props.data, dimensions, fraction, themeColors, metadataField);

	}, [theme, fraction, metadataField]);


	// create MUI buttons with callback functions to e.g. change theme
	function changeTheme(event: React.MouseEvent<HTMLInputElement, MouseEvent>, newTheme: CellPopTheme | null) {
		if (newTheme !== null) {
			setTheme(newTheme);
		}
		removeBoundary();
	}

	function changeFraction(event: React.MouseEvent<HTMLInputElement, MouseEvent>, newFraction: boolean | null) {
		if (newFraction !== null) {
			setFraction(newFraction);
		}
		removeBoundary();
	}

	function changeMetadataField(event: React.ChangeEvent<HTMLInputElement>) {
		setMetadataField(event.target.value);
		removeBoundary();
	}

	function resetData() {
		// get theme colors
		const themeColors = getTheme(theme);

		// // change background theme
		d3.selectAll(".background").style("fill", themeColors.background);

		resetLayeredBar();

		renderCellPopVisualization(props.data, dimensions, fraction, themeColors, metadataField, true);
		removeBoundary();
	}

	function resetLayeredBar() {
		resetExtensionChart(props.data);
		removeBoundary();
	}

	// animation pop-up
	const handleAnimantionPopup = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		setAnimationAnchor(animationAnchor ? null : event.currentTarget);
		removeBoundary();
	};

	function showBoundary() {
		const themeColors = getTheme(theme);
		const smth = drawSizeBoundaries(props.data, dimensions, fraction, themeColors, metadataField);
		setBoundary(true);
	}

	function removeBoundary() {
		removeSizeBoundaries();
		setBoundary(false);
	}

	return (
		<div>
			<Stack spacing={6} direction="row">

				<Button variant="outlined" onClick={resetData}>Reset data</Button>

				<Button variant="outlined" onClick={resetLayeredBar}>Reset layered bar chart</Button>

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
							return <MenuItem value={d[0]} key={d[0]}>{d[0]}</MenuItem>;
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

				{boundary ?
					<Button variant="outlined" onClick={removeBoundary}>Remove boundary boxes</Button>
					: <Button variant="outlined" onClick={showBoundary}>Show boundary boxes</Button>
				}

				<Button variant="outlined" onClick={handleAnimantionPopup}>
					Show animation
				</Button>

			</Stack>

			<Popup open={animationAnchor ? true : false} anchor={animationAnchor} placement="bottom-end">
				<div aria-label="Pop up animation" style={{border: "solid black 2px", backgroundColor: "white"}}>
					<Button variant="outlined" onClick={() => showAnimationBox(props.data, dimensions.global.width.total / 2, dimensions.global.height.total / 2)}>Play animation</Button>
					<div>
						<svg className="animate-svg" width={dimensions.global.width.total / 2} height={dimensions.global.height.total / 2}></svg>
					</div>

				</div>
			</Popup>

			{/* <Box sx={{position: "relative"}}>
				{animationAnchor ? <svg className="animate-svg" width={dimensions.global.width / 2} height={dimensions.global.height / 2}></svg> : null}
			</Box> */}

			<div id="cellpopvis" ref={cellPopRef} style={{position: "absolute", padding: "100px"}}></div>

		</div>
	);
};
