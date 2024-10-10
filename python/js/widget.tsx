import * as React from "react";
import { createRender, useModelState } from "@anywidget/react";
import * as cellpop from "cellpop";

// test
const render = createRender(() => {
	const [uuids, setUuids] = useModelState<string[]>("uuids");
    let [data, setData] = React.useState(null);

      React.useEffect(() => {
        cellpop.loadHuBMAPData(uuids).then(setData);
      }, [uuids])
    
    console.log("data", data);

    const dimensions = cellpop.getDimensions();
    console.log("dimensions", dimensions);

	return (
		<div className="cellpop">
            {data ? <cellpop.CellPop data={data} theme={"light"} dimensions={dimensions} /> : null}
		</div>
	);
});

export default { render };
