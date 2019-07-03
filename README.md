# jupyterlab-infoboxes
A JupyterLab extension that displays IBM Cloud offerings and other promotional material in JupyterLab notebooks.

This extension displays infoboxes to Skills Network Labs users in their notebooks. The infoboxes are markdown snippets chosen at random from [the files in this repo's infoboxes directory](https://github.com/cognitive-class/jupyterlab-infobox-content/tree/master/infoboxes).

## Initial Setup

- Create a conda environment for developing this extension: `conda create -n jupyterlab-infoboxes -y && conda activate jupyterlab-infoboxes`
- install jupyterlab: `conda install -c conda-forge jupyterlab==1.0.1 -y`
- `cp .env.template .env`

## Development

- install dependencies and build: `yarn install && yarn run build`
- install the lab extension: `jupyter labextension link .`
- To watch and automatically rebuild the lab extension run `yarn run watch`
- In a separate terminal window, run `jupyter lab` to start jupyterlab.
- Changes to the lab extension will trigger automatic rebuilds of the extension as you make changes.
