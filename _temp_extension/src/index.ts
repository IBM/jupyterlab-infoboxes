import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the jupyterlab-sn-infoboxes extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-sn-infoboxes:plugin',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupyterlab-sn-infoboxes is activated!');
  }
};

export default extension;
