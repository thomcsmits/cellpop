import * as React from "react";
import { createRender, useModelState } from "@anywidget/react";
import * as cellpop from "cellpop";
// test
const render = createRender(() => {
	const [value, setValue] = useModelState<number>("value");
    let [data, setData] = React.useState(null);

      React.useEffect(() => {
        cellpop.loadHuBMAPData(["018a905cdbdff684760859f594d3fd77"]).then(setData);
          console.log("data has loaded");
      }, [])
    
    console.log("data", data);

    const dimensions = cellpop.getDimensions();
    console.log("dimensions", dimensions);

	return (
		<div className="cellpop">
			<button onClick={() => setValue(value + 1)}>
				count is {value}
			</button>

            {/* {data ? <cellpop.CellPop data={data} theme={"light"} dimensions={dimensions} /> : null} */}
		</div>
	);
});

export default { render };
