import { AnnDataSource, ObsSetsAnndataLoader } from "@vitessce/zarr";
import { HuBMAPMetaData, ObsSets, dataOrdering } from "../cellpop-schema";
import { getCountsFromObsSetsList } from "./dataLoaders";
import { loadDataWithCounts } from "./dataWrangling";

export function loadHuBMAPData(
  uuids: string[],
  ordering?: dataOrdering,
  metadataFields?: string[],
) {
  // let t0 = performance.now()
  const urls = uuids.map(getHuBMAPURL);
  // for each url, check if predicted_CLID or predicted_label

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
        const counts = getCountsFromObsSetsList(obsSetsList, hubmapIDs);
        const data = loadDataWithCounts(counts, undefined, ordering);
        data.metadata = { rows: metadata };
        return data;
      }
    })
    .catch((error) => {
      console.error(error);
    });

  return hubmapData;
}

// get hubmap url to zarr
function getHuBMAPURL(uuid: string) {
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
            name: "Cell Ontology Annotation",
            path: "obs/predicted_CLID", //"obs/predicted_label"
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
): Promise<void | [string[], [string, any]]> {
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
      const metadata = listAll.map((l: HuBMAPMetaData) => {
        const ls = l._source;
        const dmm = l._source.donor.mapped_metadata;
        return {
          row: ls.hubmap_id,
          metadata: {
            title: ls.title,
            dataset_type: ls.dataset_type,
            anatomy_2: ls.anatomy_2[0],
            sex: dmm.sex[0],
            age: dmm.age_value[0],
          },
        };
      }) as [string, any];
      const hubmapIDs = listAll.map(
        (l: HuBMAPMetaData) => l._source.hubmap_id,
      ) as string[]; // return {[l._source.uuid]: l._source.hubmap_id};
      return [hubmapIDs, metadata] as [string[], [string, any]];
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  return promiseMetadata;
}
