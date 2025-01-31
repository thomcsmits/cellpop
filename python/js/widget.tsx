import { createRender, useModelState } from "@anywidget/react";
import * as cellpop from "cellpop";
import * as React from "react";
import { CellPopData } from "../../src/cellpop-schema";


const render = createRender(() => {
  const [uuids, setUuids] = useModelState<string[]>("uuids");
  const [dataDict, setDataDict] = useModelState<Record<string, Record<string, number>>>("dataDict");
  const [data, setData] = React.useState<CellPopData | null>(null);

  React.useEffect(() => {
    if (uuids.length > 0) { 
      cellpop.loadHuBMAPData(uuids).then((d) => setData(d!));
    }
  }, [uuids]);

  // if both uuids and dataDict are defined, dataDict takes precedence
  React.useEffect(() => {
    if (Object.keys(dataDict).length > 0) {
      const loaded = cellpop.loadDataWithCounts(dataDict);
      loaded.metadata = {
        rows: {},
        cols: {},
      };
      setData(loaded);
    }
  }, [dataDict]);

  return (
    <div className="cellpop">
      {data ? (
        <cellpop.CellPop
          data={data}
          theme={"light"}
          dimensions={{ width: 1000, height: 700 }}
          yAxisConfig={{
            label: "Sample",
            createHref: (row) =>
              `https://portal.hubmapconsortium.org/browse/${row}`,
            flipAxisPosition: true,
          }}
          xAxisConfig={{
            label: "Cell Type",
            createHref: (col) =>
              `https://www.ebi.ac.uk/ols4/search?q=${col}&ontology=cl`,
            flipAxisPosition: true,
          }}
        />
      ) : (
        "Loading..."
      )}
    </div>
  );
});

export default { render };
