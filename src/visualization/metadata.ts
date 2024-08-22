import { CellPopData } from "../cellpop-schema";

export function getPossibleMetadataSelections(data: CellPopData) {
    const rowsMeta = data.metadata.rows;
    const rowsMetaOptionsShown = [] as [string, (string | number)[]][];

    if (rowsMeta) {
        // get all the metadata fields (not all rows may have the same fields)
        const rowsMetaOptions = [...new Set(rowsMeta.map(r => Object.keys(r.metadata)).flat())];
        for (const op of rowsMetaOptions) {
            const opVals = [...new Set(rowsMeta.map(r => r.metadata[op]))] as (string | number)[];
            // only include the option if fields are not all the same or all different
            if (opVals.length > 1 && opVals.length < data.rowNames.length) {
                rowsMetaOptionsShown.push([op, opVals.sort()]);
            }
        }
    }
    return rowsMetaOptionsShown;
}

export function sortByMetadata(data: CellPopData, op: string) {
    const rowsMeta = data.metadata.rows;

    const opVals = rowsMeta.map(r => [r.row, r.metadata[op[0]]]);

    // // Update the ordering of rowNames
    // data.rowNames = reorderArray(data.rowNames, currentIndex, newIndex);
    // data.rowNamesWrapped = reorderArray(data.rowNamesWrapped, currentIndex, newIndex);
    // data.counts = reorderArray(data.counts, currentIndex, newIndex);

}