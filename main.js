import * as d3 from "d3";
import { ObsSetsAnndataLoader } from '@vitessce/zarr';

const url = 'https://assets.hubmapconsortium.org/ad693f99fb9006e68a53e97598da1509/hubmap_ui/anndata-zarr/secondary_analysis.zarr';

const source = new AnnDataSource({ url });
const config = {
    url,
    fileType: 'obsSets.anndata.zarr',
    options: [
    {
        name: 'Cell Ontology Annotation',
        path: 'obs/predicted_label'
    }
    ],
};

const loader = new ObsSetsAnndataLoader(source, config);
const { data: { obsSets } } = await loader.load();
console.log('data', obsSets)
