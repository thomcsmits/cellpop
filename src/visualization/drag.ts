import * as d3 from "d3";

import { reorderArray } from "./util";
import { renderExtensionChart } from "./barExtensions";
import { wrapRowNames, wrapColNames } from "../dataLoading/dataWrangling";
import {
  CellPopData,
  CellPopDimensions,
  CellPopThemeColors,
  ColNamesWrapped,
  CountsMatrixValue,
  RowNamesWrapped,
} from "../cellpop-schema";

/** DRAG FUNCTION FOR ROWS */
let offsetRows, offsetCols;
// todo: get offset on start drag and add to y and x on drag.

// Drag start function
export function dragstartedRows(
  event: d3.D3DragEvent<SVGRectElement, CountsMatrixValue, d3.SubjectPosition>,
  d: CountsMatrixValue & { y?: number },
) {
  const rects = d3.selectAll<SVGRectElement, CountsMatrixValue>(
    ".heatmap-rects",
  );
  const rowsBehind = d3.selectAll<SVGRectElement, RowNamesWrapped>(
    ".heatmap-rows",
  );

  // Set dragged elements to active
  rowsBehind
    .filter((r) => r.row === d.row)
    .raise()
    .classed("active", true);
  rects
    .filter((r) => r.row === d.row)
    .raise()
    .classed("active", true);
  d3.select(".highlight-rows").raise().classed("active", true);
}

// Dragging function
export function draggedRows(
  event: d3.D3DragEvent<SVGRectElement, CountsMatrixValue, d3.SubjectPosition>,
  d: CountsMatrixValue & { y?: number },
  data: CellPopData,
  y: d3.ScaleBand<string>,
  allowClick: boolean,
): [CellPopData, boolean] {
  const rects = d3.selectAll<SVGRectElement, CountsMatrixValue>(
    ".heatmap-rects",
  );
  const rowsBehind = d3.selectAll<SVGRectElement, RowNamesWrapped>(
    ".heatmap-rows",
  );

  // Let the selected row and rects on that row and highlight move with the cursor
  rowsBehind.filter((r) => r.row === d.row).attr("y", event.y);
  rects.filter((r) => r.row === d.row).attr("y", event.y);
  d3.select(".highlight-rows").attr("y", event.y);

  // Calculate the current index of the dragged row
  const currentIndex = data.rowNames.indexOf(d.row);

  // Calculate the new index based on the y-coordinate of the drag event
  const rowSize = y(data.rowNames[0]) - y(data.rowNames[1]);
  let newIndex =
    data.rowNames.length -
    Math.ceil((event.y - y.paddingOuter() * y.bandwidth()) / rowSize);

  // If row goes beyond boundaries, set it to the first/last item
  if (newIndex < 0) {
    newIndex = 0;
  }
  if (newIndex >= data.rowNames.length) {
    newIndex = data.rowNames.length - 1;
  }

  // If row stays at the same place, return
  if (newIndex === currentIndex) {
    return [data, allowClick];
  }

  // Calculate the displacement of the dragged row
  const displacement = newIndex - currentIndex;

  // For each row, calculate the new y position
  rowsBehind.each(function (rowName: RowNamesWrapped) {
    const rowIndex = data.rowNames.indexOf(rowName.row);
    // Get the rows that are affected (between the currentIndex and newIndex)
    if (
      rowIndex !== currentIndex &&
      rowIndex >= Math.min(currentIndex, newIndex) &&
      rowIndex <= Math.max(currentIndex, newIndex)
    ) {
      // Shift the row up or down depending on the direction of the moved row
      if (displacement > 0) {
        rowsBehind
          .filter((r) => r.row === rowName.row)
          .attr("y", y(data.rowNames[rowIndex - 1]));
        rects
          .filter((r) => r.row === rowName.row)
          .attr("y", y(data.rowNames[rowIndex - 1]));
      } else {
        rowsBehind
          .filter((r) => r.row === rowName.row)
          .attr("y", y(data.rowNames[rowIndex + 1]));
        rects
          .filter((r) => r.row === rowName.row)
          .attr("y", y(data.rowNames[rowIndex + 1]));
      }
    }
  });

  // Update the ordering of rowNames
  data.rowNames = reorderArray(data.rowNames, currentIndex, newIndex);
  wrapRowNames(data);

  return [data, false];
}

// Drag end function
export function dragendedRows(
  event: d3.D3DragEvent<SVGRectElement, CountsMatrixValue, d3.SubjectPosition>,
  d: CountsMatrixValue & { y?: number },
  data: CellPopData,
  dimensions: CellPopDimensions,
  themeColors: CellPopThemeColors,
  x: d3.ScaleBand<string>,
  y: d3.ScaleBand<string>,
  allowClick: boolean,
) {
  const rects = d3.selectAll<SVGRectElement, CountsMatrixValue>(
    ".heatmap-rects",
  );
  const rowsBehind = d3.selectAll<SVGRectElement, RowNamesWrapped>(
    ".heatmap-rows",
  );

  // Get the current index and set the y-coordinate of this row when drag ends
  const currentIndex = data.rowNames.indexOf(d.row);
  rowsBehind
    .filter((r) => r.row === d.row)
    .attr("y", y(data.rowNames[currentIndex]));
  rects
    .filter((r) => r.row === d.row)
    .attr("y", y(data.rowNames[currentIndex]));
  d3.select(".highlight-rows").attr("y", y(data.rowNames[currentIndex]));

  // Set dragged elements to inactive
  rowsBehind.filter((r) => r.row === d.row).classed("active", false);
  rects.filter((r) => r.row === d.row).classed("active", false);
  d3.select(".highlight-rows").classed("active", false);

  // if the row hasn't moved, create extending bar chart
  if (allowClick) {
    data.extendedChart.rowNames.push(d.row);
    renderExtensionChart(data, dimensions, themeColors, x);
  }
}

/** DRAG FUNCTION FOR COLS */

// Drag start function
export function dragstartedCols(
  event: d3.D3DragEvent<SVGRectElement, CountsMatrixValue, d3.SubjectPosition>,
  d: CountsMatrixValue & { x?: number },
) {
  const rects = d3.selectAll<SVGRectElement, CountsMatrixValue>(
    ".heatmap-rects",
  );
  const colsBehind = d3.selectAll<SVGRectElement, ColNamesWrapped>(
    ".heatmap-cols",
  );

  // Set dragged elements to active
  colsBehind
    .filter((r) => r.col === d.col)
    .raise()
    .classed("active", true);
  rects
    .filter((r) => r.col === d.col)
    .raise()
    .classed("active", true);
  d3.select(".highlight-cols").raise().classed("active", true);
}

// Dragging function
export function draggedCols(
  event: d3.D3DragEvent<SVGRectElement, CountsMatrixValue, d3.SubjectPosition>,
  d: CountsMatrixValue & { x?: number },
  data: CellPopData,
  x: d3.ScaleBand<string>,
  allowClick: boolean,
): [CellPopData, boolean] {
  const rects = d3.selectAll<SVGRectElement, CountsMatrixValue>(
    ".heatmap-rects",
  );
  const colsBehind = d3.selectAll<SVGRectElement, ColNamesWrapped>(
    ".heatmap-cols",
  );

  // Let the selected col and rects on that col and highlight move with the cursor
  colsBehind.filter((r) => r.col === d.col).attr("x", event.x);
  rects.filter((r) => r.col === d.col).attr("x", event.x);
  d3.select(".highlight-cols").attr("x", event.x);

  // Calculate the current index of the dragged col
  const currentIndex = data.colNames.indexOf(d.col);

  // Calculate the new index based on the x-coordinate of the drag event
  const colSize = x(data.colNames[1]) - x(data.colNames[0]);
  let newIndex = Math.ceil(
    (event.x - x.paddingOuter() * x.bandwidth()) / colSize,
  );

  // If col goes beyond boundaries, set it to the first/last item
  if (newIndex < 0) {
    newIndex = 0;
  }
  if (newIndex >= data.colNames.length) {
    newIndex = data.colNames.length - 1;
  }

  // If col stays at the same place, return
  if (newIndex === currentIndex) {
    return [data, allowClick];
  }

  // Calculate the displacement of the dragged col
  const displacement = newIndex - currentIndex;

  // For each col, calculate the new y position
  colsBehind.each(function (colName) {
    const colIndex = data.colNames.indexOf(colName.col);
    // Get the cols that are affected (between the currentIndex and newIndex)
    if (
      colIndex !== currentIndex &&
      colIndex >= Math.min(currentIndex, newIndex) &&
      colIndex <= Math.max(currentIndex, newIndex)
    ) {
      // Shift the col up or down depending on the direction of the moved col
      if (displacement > 0) {
        colsBehind
          .filter((r) => r.col === colName.col)
          .attr("x", x(data.colNames[colIndex - 1]));
        rects
          .filter((r) => r.col === colName.col)
          .attr("x", x(data.colNames[colIndex - 1]));
      } else {
        colsBehind
          .filter((r) => r.col === colName.col)
          .attr("x", x(data.colNames[colIndex + 1]));
        rects
          .filter((r) => r.col === colName.col)
          .attr("x", x(data.colNames[colIndex + 1]));
      }
    }
  });

  // Update the ordering of colNames
  data.colNames = reorderArray(data.colNames, currentIndex, newIndex);
  wrapColNames(data);

  return [data, false];
}

// Drag end function
export function dragendedCols(
  event: d3.D3DragEvent<SVGRectElement, CountsMatrixValue, d3.SubjectPosition>,
  d: CountsMatrixValue & { x?: number },
  data: CellPopData,
  dimensions: CellPopDimensions,
  themeColors: CellPopThemeColors,
  x: d3.ScaleBand<string>,
  y: d3.ScaleBand<string>,
  allowClick: boolean,
) {
  const rects = d3.selectAll<SVGRectElement, CountsMatrixValue>(
    ".heatmap-rects",
  );
  const colsBehind = d3.selectAll<SVGRectElement, ColNamesWrapped>(
    ".heatmap-cols",
  );

  // Get the current index and set the x-coordinate of this col when drag ends
  const currentIndex = data.colNames.indexOf(d.col);
  colsBehind
    .filter((r) => r.col === d.col)
    .attr("x", x(data.colNames[currentIndex]));
  rects
    .filter((r) => r.col === d.col)
    .attr("x", x(data.colNames[currentIndex]));
  d3.select(".highlight-cols").attr("x", x(data.colNames[currentIndex]));

  // Set dragged elements to inactive
  colsBehind.filter((r) => r.col === d.col).classed("active", false);
  rects.filter((r) => r.col === d.col).classed("active", false);
  d3.select(".highlight-cols").classed("active", false);

  // if the col hasn't moved, color the bar chart
  if (allowClick) {
    data.extendedChart.colNames.push(d.col);
    renderExtensionChart(data, dimensions, themeColors, x);
  }
}
