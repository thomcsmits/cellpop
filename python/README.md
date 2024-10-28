# Cellpop Widget
This is a Python widget for [CellPop](https://github.com/hms-dbmi/cellpop/), a scalable interactive cell population viewer. It is implemented with [anywidget](https://github.com/manzt/anywidget/). 

## Using the Cellpop Widget
It is not yet available to download as a package. 

Example usage is shown in [example.ipynb](./example.ipynb).

## Local development

### Set up

Create a virtual environment and and install python in *editable* mode with the optional development dependencies:

```sh
python -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
```

You then need to install the JavaScript dependencies and run the development server.

```sh
pnpm install
pnpm run dev
```

### Start a session
You need the following three items running: 
1. `pnpm run dev` in cellpop
2. `pnpm run dev` in python
3. Open `example.ipynb` in JupyterLab, VS Code, or your favorite editor
to start developing. 

Changes made in `js/` will be reflected in the notebook.
