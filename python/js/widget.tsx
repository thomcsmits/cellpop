import { createRender, useModelState } from "@anywidget/react";
import * as cellpop from "cellpop";
import * as React from "react";

// test
const render = createRender(() => {
	const [uuids, setUuids] = useModelState<string[]>("uuids");
    let [data, setData] = React.useState(null);

      React.useEffect(() => {
        cellpop.loadHuBMAPData(uuids).then(setData);
      }, [uuids])

	return (
		<div className="cellpop">
      {data ? 
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
      : null}
		</div>
	);
});

export default { render };
