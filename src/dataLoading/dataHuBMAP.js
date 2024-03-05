import { AnnDataSource, ObsSetsAnndataLoader } from "@vitessce/zarr";
import { getCountsFromObsSetsList } from "./dataLoaders";
import { loadDataWithCounts } from "./dataWrangling";

export function loadHuBMAPData(uuids, ordering, metadataFields) {
    const urls = uuids.map(getHuBMAPURL);
    // for each url, check if predicted_CLID or predicted_label
    const hubmapData = Promise.all([getPromiseData(urls), getPromiseMetadata(uuids)]).then((values) => {
        const obsSetsList = values[0];
        const hubmapIDs = values[1][0];
        const metadata = values[1][1];
        const counts = getCountsFromObsSetsList(obsSetsList, hubmapIDs);
        let data = loadDataWithCounts(counts, ordering=ordering);
        data.metadata = metadata;
        return data;
    }).catch(error => {
        console.error(error);
    });
    
    return hubmapData;
}

// get hubmap url to zarr
function getHuBMAPURL(uuid) {
	return `https://assets.hubmapconsortium.org/${uuid}/hubmap_ui/anndata-zarr/secondary_analysis.zarr`;
}


// Get one Promise with all ObsSets
function getPromiseData(urls) {
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

    let promiseData = Promise.all(obsSetsListPromises).then(obsSetsListWrapped => {
		// wrangle data
		let obsSetsList = obsSetsListWrapped.map((o) => o.data.obsSets);
		return obsSetsList;
    })
    .catch(error => {
        console.error(error);
    });
	return promiseData
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
			let metadata = listAll.map(l => {
				let ls = l._source;
				let dmm = l._source.donor.mapped_metadata;
				return {row: ls.uuid, metadata: {title: ls.title, dataset_type: ls.dataset_type, anatomy_2: ls.anatomy_2[0], sex: dmm.sex[0], age: dmm.age_value[0]}};
			})
			let hubmapIDs = listAll.map(l => l._source.hubmap_id); // return {[l._source.uuid]: l._source.hubmap_id};
			return [hubmapIDs, metadata];
		})
		.catch(error => {
			console.error('Error:', error);
		});
	return promiseMetadata;
} 
