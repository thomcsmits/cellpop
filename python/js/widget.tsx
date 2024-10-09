import * as React from "react";
import { createRender, useModelState } from "@anywidget/react";
import * as cellpop from "cellpop";
// test
const render = createRender(() => {

    console.log("rendered")
	return (
		<div className="cellpop">
			<button>hello</button>
            <cellpop.CellPop />
		</div>
	);
});

export default { render };
