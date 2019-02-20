import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import {
  INotebookTracker
} from '@jupyterlab/notebook';

import * as showdown from 'showdown';

import '../style/index.css';

const converter = new showdown.Converter();

function createInfoBox(): Promise<Node> {
  return new Promise((resolve, reject) => {

      fetch('https://api.github.com/repos/cognitive-class/jupyterlab-infobox-content/contents/infoboxes').then(response => {
        return response.json();
    }).then(infoboxes => {
      var randomInfobox = infoboxes[Math.floor(Math.random() * infoboxes.length)];
      if (randomInfobox && randomInfobox.download_url) {
        return randomInfobox.download_url;
      } else {
        reject("failed to fetch infobox.");
      }
    }).then(url => {
      console.log(`fetching ${url}`)
      fetch(url).then(response => {
        return response.text();
      }).then(markdown => {
        setTimeout(() => { // hack until I find a better event to call this on
                var infoBox = document.createElement('div');
                infoBox.className = "jupyterlab-infoboxes p-Widget jp-Cell jp-CodeCell jp-RenderedHTMLCommon jp-RenderedMarkdown";
                infoBox.innerHTML = converter.makeHtml(markdown)
                resolve(infoBox);
              }, 300);
            })
            
      }).catch(error => {
        console.error(error);
      })
    })
}

function isEmptyNotebook(notebook: any): boolean {
  return (notebook.content.model.cells.length < 2);
}


/**
 * Initialization data for the jupyterlab-infoboxes extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'jupyterlab-infoboxes',
  autoStart: true,
  requires: [INotebookTracker],
  activate: (app: JupyterLab, notebookTracker: INotebookTracker) => {
    
    // on startup, notebooks may already be open
    notebookTracker.forEach((notebook) => {
        if (notebook.node.classList.contains("has-jupyterlab-infoboxes")) { 
          return; 
        } else {
          notebook.node.classList.add("has-jupyterlab-infoboxes");
          createInfoBox().then((infoBox) => {
            if (isEmptyNotebook(notebook)) {return;};
            notebook.node.childNodes[1].appendChild(infoBox);
          })
        }
      })

    // handle new notebooks being opened
    notebookTracker.widgetAdded.connect((tracker) => {
      tracker.forEach((notebook) => {
        if (notebook.node.classList.contains("has-jupyterlab-infoboxes")) { 
          return; 
        } else {
          notebook.node.classList.add("has-jupyterlab-infoboxes");
          createInfoBox().then((infoBox) => {
            if (isEmptyNotebook(notebook)) {return;};
            notebook.node.childNodes[1].appendChild(infoBox);
          })
        }
      })
    })  
  }
};

export default extension;
