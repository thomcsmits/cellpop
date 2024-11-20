import { AnnDataSource, ObsSetsAnndataLoader } from "@vitessce/zarr";
import { HuBMAPSearchHit, ObsSets, dataOrdering } from "../cellpop-schema";
import { getCountsAndMetadataFromObsSetsList } from "./dataLoaders";
import { loadDataWithCounts } from "./dataWrangling";

export function loadHuBMAPData(uuids: string[], ordering?: dataOrdering) {
  const urls = uuids.map(getHubmapURL);

  const obsSetsListPromises = getPromiseData(urls);
  const promiseData = Promise.all(obsSetsListPromises)
    .then((obsSetsListWrapped) => {
      // wrangle data
      const obsSetsList = obsSetsListWrapped.map((o) => o.data.obsSets);
      return obsSetsList as ObsSets[];
    })
    .catch((error) => {
      console.error(error);
    });
  const hubmapData = Promise.all([promiseData, getPromiseMetadata(uuids)])
    .then((values) => {
      if (values[0] && values[1]) {
        const obsSetsList = values[0];
        const hubmapIDs = values[1][0];
        const metadata = values[1][1];
        const { counts, metadata: datasetMetadata } =
          getCountsAndMetadataFromObsSetsList(obsSetsList, hubmapIDs);
        const data = loadDataWithCounts(counts, undefined, ordering);
        data.metadata = { rows: metadata, cols: datasetMetadata };
        return data;
      }
    })
    .catch((error) => {
      console.error(error);
    });

  return hubmapData;
}

// get hubmap url to zarr
function getHubmapURL(uuid: string) {
  return `https://assets.hubmapconsortium.org/${uuid}/hubmap_ui/anndata-zarr/secondary_analysis.zarr`;
}

// Get one Promise with all ObsSets
function getPromiseData(urls: string[]) {
  const obsSetsListPromises = [];
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const source = new AnnDataSource({ url, fileType: "obsSets.anndata.zarr" });
    const config = {
      url,
      fileType: "obsSets.anndata.zarr",
      options: {
        obsSets: [
          {
            name: "Cell Ontology CLID",
            path: "obs/predicted_CLID",
          },
          {
            name: "Cell Ontology Label",
            path: "obs/predicted_label",
          },
        ],
      },
      type: "obsSets",
    } as const;
    const loader = new ObsSetsAnndataLoader(source, config);
    obsSetsListPromises.push(loader.load());
  }
  return obsSetsListPromises;
}

// get metadata
function getPromiseMetadata(
  uuids: string[],
): Promise<void | [string[], Record<string, string | number>]> {
  const searchApi = "https://search.api.hubmapconsortium.org/v3/portal/search";
  const queryBody = {
    size: 10000,
    query: { ids: { values: uuids } },
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(queryBody),
  };

  const promiseMetadata = fetch(searchApi, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((queryBody) => {
      const listAll = queryBody.hits.hits;
      console.log({ listAll });
      const metadata: Record<string, string | number> = listAll.reduce(
        (acc: Record<string, unknown>, l: HuBMAPSearchHit) => {
          const ls = l._source;
          const dmm = l._source.donor.mapped_metadata;
          return {
            ...acc,
            [ls.hubmap_id]: {
              title: ls.title,
              dataset_type: ls.dataset_type,
              anatomy: ls?.anatomy_2?.[0] ?? ls?.anatomy_1?.[0],
              sex: dmm.sex[0],
              age: dmm.age_value[0],
            },
          };
        },
        {},
      );
      const hubmapIDs = Object.keys(metadata);
      return [hubmapIDs, metadata] as [
        string[],
        Record<string, string | number>,
      ];
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  return promiseMetadata;
}
