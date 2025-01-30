import importlib.metadata
import pathlib

import anywidget
import traitlets

try:
    __version__ = importlib.metadata.version("cellpop")
except importlib.metadata.PackageNotFoundError:
    __version__ = "unknown"


class Widget(anywidget.AnyWidget):
    _esm = pathlib.Path(__file__).parent / "static" / "widget.js"
    _css = pathlib.Path(__file__).parent / "static" / "widget.css"
    uuids = traitlets.List(traitlets.Unicode(), default_value=[]).tag(sync=True)
    dataDict = traitlets.Dict(default_value={}).tag(sync=True)
