import importlib.metadata
import pathlib

import anywidget
import traitlets

import pandas as pd
import warnings

try:
    __version__ = importlib.metadata.version("cellpop")
except importlib.metadata.PackageNotFoundError:
    __version__ = "unknown"


class CpWidget(anywidget.AnyWidget):
    _esm = pathlib.Path(__file__).parent / "static" / "widget.js"
    _css = pathlib.Path(__file__).parent / "static" / "widget.css"
    uuids = traitlets.List(traitlets.Unicode(), default_value=[]).tag(sync=True)
    df = traitlets.Instance(pd.DataFrame, default_value=pd.DataFrame())
    dataDict = traitlets.Dict(default_value={}).tag(sync=True)

    @traitlets.observe("df")
    def _update_dataDict(self, change):
        self.dataDict = change.new.to_dict()


def cpProcessData(dataSource, is_h5ad, rowNames, colNameDf, rowMetadata=None, colMetadata=None):
    if len(dataSource) > len(rowNames): 
        warnings.warn("Not enough rowNames supplied.")
        return
    if len(dataSource) < len(rowNames): 
        warnings.warn("Warning: more rowNames supplied than data sources. Last rowNames will not be used.")

    df = None
    for i in range(len(dataSource)):
        if is_h5ad:
            adata_i = ad.read_h5ad(dataSource[i])
            obs_i = adata_i.obs
            del adata_i
        else:
            obs_i = dataSource[i]
        
        if colNameDf not in obs_i.keys(): 
            warnings.warn(f"Dataset {rowNames[i]} does not have label {colNameDf} in obs. Dataset skipped.")
            continue
        obs_i = obs_i[[colNameDf]].reset_index(names=rowNames[i])
        counts_i = obs_i.groupby(colNameDf, observed=True).count().T
        df = pd.concat([df, counts_i], join="outer").fillna(0)
    df = df.astype(int)
    return df


def cpAnnDataList(adLocations, rowNames, colNameDf, rowMetadata=None, colMetadata=None):
    return cpProcessData(adLocations, True, rowNames, colNameDf, rowMetadata=None, colMetadata=None)


def cpObsDfList(obsList, rowNames, colNameDf, rowMetadata=None, colMetadata=None):
    return cpProcessData(obsList, False, rowNames, colNameDf, rowMetadata=None, colMetadata=None)
