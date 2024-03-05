function loadHuBMAPData(uuids, ordering, metadata) {
    const urls = uuids.map(getHuBMAPURL);



    // for each url, check if predicted_CLID or predicted_label

    
}

// get hubmap url to zarr
function getHuBMAPURL(uuid) {
	return `https://assets.hubmapconsortium.org/${uuid}/hubmap_ui/anndata-zarr/secondary_analysis.zarr`;
}


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
	return Promise.all(obsSetsListPromises)
}



// get metadata
function getHuBMAPMetadata(uuids) {
	let searchApi = 'https://search.api.hubmapconsortium.org/v3/portal/search';
	let queryBody = {
		"size": 10000,
		"query": {
            "ids": {
                "values": uuids
            }
        },
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
			return metadata;
		})
		.catch(error => {
			console.error('Error:', error);
		});
	return promiseMetadata;
} 

// let promiseMetadata = getMetadata(uuids);


// Promise.all([promiseData, promiseMetadata]).then((values) => {
// 	let data = values[0];
// 	let metadata = values[1];
// 	data.metadata = {rows: metadata};
// 	// console.log('data', data)
// 	// showAnimation(data);
// 	getMainVis(data);

// 	loadDataWithCountsMatrix(data.countsMatrix);
// })
