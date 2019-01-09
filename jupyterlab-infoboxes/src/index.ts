import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import { // probably can remove this
  IDocumentManager
} from '@jupyterlab/docmanager';

import {
  INotebookTracker
} from '@jupyterlab/notebook';

import '../style/index.css';

function createInfoBox(): Promise<Node> {
  return new Promise((resolve, reject) => {
      // stand in for function that gets infobox from somewhere
      setTimeout(() => {
        var infoBox = document.createElement('div');
        infoBox.className = "jupyterlab-infoboxes p-Widget jp-Cell jp-CodeCell jp-RenderedHTMLCommon jp-RenderedMarkdown";
        infoBox.innerHTML = `<em>Did you know?</em> IBM Watson Studio lets you build and deploy an AI solution, using the best of open source and IBM software and giving your team a single environment to work in. Learn more at <a href="https://cocl.us/ibm_watson_studio_infobox">https://cocl.us/ibm_watson_studio_infobox</a>`;
        resolve(infoBox);
      }, 300)
    })
}

function isEmptyNotebook(notebook: any): boolean {
  console.log(notebook.content.model.cells.length);
  return (notebook.content.model.cells.length < 2);
}


/**
 * Initialization data for the jupyterlab-infoboxes extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'jupyterlab-infoboxes',
  autoStart: true,
  requires: [IDocumentManager, INotebookTracker],
  activate: (app: JupyterLab, docmanager: IDocumentManager, notebookTracker: INotebookTracker) => {
    console.log('JupyterLab extension jupyterlab-infoboxes is activated!');
    
    notebookTracker.widgetAdded.connect((tracker) => {
      tracker.forEach((notebook) => {
        console.log(notebook);
        if (notebook.node.classList.contains("has-jupyterlab-infoboxes")) { 
          return; 
        } else {
          notebook.node.classList.add("has-jupyterlab-infoboxes");
          createInfoBox().then((infoBox) => {
            console.log('test',notebook.content.model.cells.length);
            if (isEmptyNotebook(notebook)) {return;};
            notebook.node.childNodes[1].appendChild(infoBox);
          })
        }
      })
    })  
  }
};

export default extension;
