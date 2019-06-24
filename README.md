# jupyterlab-infoboxes
A JupyterLab extension that displays IBM Cloud offerings and other promotional material in JupyterLab notebooks.

Insert Infoboxes into JupyterLab Notebooks

# Initial Setup

- Create a conda environment for developing this extension: `conda create -n jupyterlab-infoboxes -y && conda activate jupyterlab-infoboxes`
- install jupyterlab: `pip install jupyterlab==1.0.0rc.0` #`conda install jupyterlab`

## Development

- install dependencies and build: `yarn install && yarn run build`
- install the lab extension: `jupyter labextension link .`
- To watch and automatically rebuild the lab extension run `yarn run watch`
- In a separate terminal window, run `jupyter lab` to start jupyterlab.
- Changes to the lab extension will trigger automatic rebuilds of the extension as you make changes.
