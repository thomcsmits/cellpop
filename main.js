import * as d3 from "d3";
import { AnnDataSource, ObsSetsAnndataLoader } from "@vitessce/zarr";
import { getMainVis } from "./src/visualization";
import { showAnimation } from "./src/visualization/animation";
import { loadDataWithCountsMatrix, loadDataWithCounts } from "./src/dataLoading/dataWrangling";
// import { getHubMAPIDs } from "./src/dataLoading/dataHuBMAP"; 

// data
var uuids = ['ad693f99fb9006e68a53e97598da1509',
    '173de2e80adf6a73ac8cff5ccce20dfc',
	'b95f34761c252ebbd1e482cd9afae73f',
	'5a5ca03fa623602d9a859224aa40ace4',
	'3c1b10bc912c60c9afc36b7423695236',
	'1dc16eb0270ff73291dd45b6a96aa3c0',
	'b05c21f9c94ce1a22a9694cd0fe0291e',
	'8cdb42ed1194255c74c8462b99bbd7ef',
	'fe0ded5fc0355c95239f9c040dd31e99',
	'367fee3b40cba682063289505b922be1',
	'b99fc30c4195958fbef217fa9ed9ec8f',
	'898138b7f45a67c574e9955fb400e9be',
	'f220c9e7bcaea3a87162cbe61287ea4d',
	'e5f7a14d93659bd0b8dc2819ffa9bc4b',
	'56cbda4789f04d79c0c3dffe21816d48',
	'0b6f63f2bd61a8c091fc7afc0f318ad1',
	'62efbe0a6abd0bcf53ab9ab29e7cd73f',
	'4b62d9d2c248323ce029859f953fdc57',
	'c81b0dc9d16eb825a7d6bce6e1b3678f',
	'5ee240959c96b49d960702755478b9fc',
	'7c9e07c96d144536525b1f889acee14d',
	'dd7ccbc306692fc5ff5e61c22845da21',
	'9a7e6be288b27ddbd3366c4ae41bbcd2',
	'018a905cdbdff684760859f594d3fd77',
	'af5741dad7aecf7960a129c3d2ae642a',
	'6e1db473492095ccc2f1393d7259b9c0',
	'fae9a1f2e7abefca2203765a3c7a5ba1',
	'8d631eee88855ac59155edca2a3bc1ca',
	'1ea6c0ac5ba60fe35bf63af8699b6fbe']

uuids = uuids.slice(0, 3);
console.log(uuids.length)

// get hubmap url to zarr
function getURL(uuid) {
	return `https://assets.hubmapconsortium.org/${uuid}/hubmap_ui/anndata-zarr/secondary_analysis.zarr`;
}
const urls = uuids.map(getURL);

// Get one Promise with all ObsSets
function retrieveObsSets(urls) {
	const obsSetsListPromises = [];
	for (let i = 0; i < urls.length; i++) { 
		const url = urls[i]
		const source = new AnnDataSource({ url });
		const config = {
			url,
			fileType: 'obsSets.anndata.zarr',
			options: [
				{
					name: 'Cell Ontology Annotation',
					path: 'obs/predicted_CLID' //'obs/predicted_label'
				}
			],
		};
		const loader = new ObsSetsAnndataLoader(source, config);
		obsSetsListPromises.push(loader.load());
	}
	return Promise.all(obsSetsListPromises);
}





// // Retrieve the ObsSets, then wrangle data and call the vis
function getPromiseData(urls) {
	let promiseData = retrieveObsSets(urls)
    .then(obsSetsListWrapped => {
		// wrangle data
		let obsSetsList = obsSetsListWrapped.map((o) => o.data.obsSets);
		return obsSetsList;
    })
    .catch(error => {
        console.error(error);
    });
	return promiseData;
}


// get metadata
function getPromiseMetadata(uuids) {
	let searchApi = 'https://search.api.hubmapconsortium.org/v3/portal/search';
	let queryBody = {
		"size": 10000,
		"query": {"ids": {"values": uuids}},
	}

	const requestOptions = {
		method: 'POST',
		headers: {
		'Content-Type': 'application/json',
		},
		body: JSON.stringify(queryBody),
	};

	let promiseMetadata = fetch(searchApi, requestOptions)
		.then(response => {
			if (!response.ok) {
			throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then(queryBody => {
			let listAll = queryBody.hits.hits;
			console.log(listAll)

			let metadata = listAll.map(l => {
				let ls = l._source;
				let dmm = l._source.donor.mapped_metadata;
				return {row: ls.uuid, metadata: {title: ls.title, dataset_type: ls.dataset_type, anatomy_2: ls.anatomy_2[0], sex: dmm.sex[0], age: dmm.age_value[0]}};
			})

			let hubmapIDs = listAll.map(l => l._source.hubmap_id) // return {[l._source.uuid]: l._source.hubmap_id};
			return [hubmapIDs, metadata];
		})
		.catch(error => {
			console.error('Error:', error);
		});
	return promiseMetadata;
} 



Promise.all([getPromiseData(urls), getPromiseMetadata(uuids), smth]).then((values) => {
	const obsSetsList = values[0];
	const uuidToHubmap = values[1][0];
	const metadata = values[1][1];

	const counts = getCountsFromObsSetsList(obsSetsList, rowNames);
	const data = loadDataWithCounts(counts, metadata=metadata);

	getMainVis(data);

	// loadDataWithCountsMatrix(data.countsMatrix);
	// loadDataWithCounts(data.counts)
	// loadDataWithVitessce(data.obsSetsList, data.rowNames);
})
