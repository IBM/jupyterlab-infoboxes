import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import {
  INotebookTracker
} from '@jupyterlab/notebook';

import * as showdown from 'showdown';

import '../style/index.css';

const converter = new showdown.Converter();

/**
 * Checks if the html element being passed is a markdown cell containing a title
 */
function cellIsATitle(cell: Element) {              
  return cell.children[1].children[1].children.length >= 3 && cell.children[1].children[1].children[2].innerHTML.startsWith("<h")
}

/**
 * Modifies the watson studio cocl.us link to include the location of the link
 * Just exists to test the best link placement -- this can be removed after 
 * the best placement has been discovered
 */
function updateLinkWithLocation(infoBox: Node, location: String) {
  (<HTMLElement> infoBox).innerHTML = (<HTMLElement> infoBox).innerHTML.replace("https://cocl.us/ibm_watson_studio_infobox", "https://cocl.us/ibm_watson_studio_infobox_"+location)
}

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
      fetch(url).then(response => {
        return response.text();
      }).then(markdown => {
        setTimeout(() => { // hack until I find a better event to call this on
                var infoBox = document.createElement('div');
                infoBox.className = "jupyterlab-infoboxes p-Widget jp-Cell jp-CodeCell jp-RenderedHTMLCommon jp-RenderedMarkdown";
                infoBox.innerHTML = converter.makeHtml(markdown)
                infoBox.style.backgroundColor = "#edf4ff";
                infoBox.style.borderColor = "#0062ff";
                infoBox.style.borderWidth = "2px";
                infoBox.style.borderStyle = "solid";
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

            // randomly decide on a location, and edit the url accordingly
            var r = Math.floor(Math.random()*4);

           
            switch (r) {
              case 0:
                // option 1: place at the beginning of notebook
                notebook.node.childNodes[1].insertBefore(infoBox, notebook.node.childNodes[1].firstChild)
                updateLinkWithLocation(infoBox, "start");
                break;
              case 1:
                // option 2: place at the end of notebook
                updateLinkWithLocation(infoBox, "end");
                notebook.node.childNodes[1].appendChild(infoBox);
                break;
              case 2:
                // option 3: place near the 1/4 point
                updateLinkWithLocation(infoBox, "quarter");
                var insertionPoint = Math.floor((<Element> notebook.node.childNodes[1]).children.length/4);
                while (!(cellIsATitle((<Element> notebook.node.childNodes[1]).children[insertionPoint]))) {
                  insertionPoint++;
                }
                if (insertionPoint === (<Element> notebook.node.childNodes[1]).children.length) { insertionPoint = 0} // display at the beginning by default if we couldn't find a good spot
                notebook.node.childNodes[1].insertBefore(infoBox, (<Element> notebook.node.childNodes[1]).children[insertionPoint])
                break;
              case 3:
                // option 4: place near halfway point
                updateLinkWithLocation(infoBox, "half");
                var insertionPoint = Math.floor((<Element> notebook.node.childNodes[1]).children.length/2);
                while (insertionPoint < (<Element> notebook.node.childNodes[1]).children.length && !(cellIsATitle((<Element> notebook.node.childNodes[1]).children[insertionPoint]))) {
                  insertionPoint++;
                }
                if (insertionPoint === (<Element> notebook.node.childNodes[1]).children.length) { insertionPoint = 0} // display at the beginning by default if we couldn't find a good spot
                notebook.node.childNodes[1].insertBefore(infoBox, (<Element> notebook.node.childNodes[1]).children[insertionPoint])
                break;
            }
          })
        }
      })
    })  
  }
};

export default extension;
