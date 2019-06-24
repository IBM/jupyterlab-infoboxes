import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from "@jupyterlab/application";

import { INotebookTracker } from "@jupyterlab/notebook";

import * as showdown from "showdown";

import "../style/index.css";

const converter = new showdown.Converter();

/**
 * Checks if the html element being passed is a markdown cell containing a title
 */
function cellIsATitle(cell: Element) {
  try {
    return (
      cell.children[1].children[1].children.length >= 3 &&
      cell.children[1].children[1].children[2].innerHTML.startsWith("<h")
    );
  } catch (err) {
    return false;
  }
}

function createInfoBox(): Promise<Node> {
  return new Promise((resolve, reject) => {
    fetch(
      "https://api.github.com/repos/cognitive-class/jupyterlab-infobox-content/contents/infoboxes"
    )
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      })
      .then(infoboxes => {
        var randomInfobox =
          infoboxes[Math.floor(Math.random() * infoboxes.length)];
        if (randomInfobox && randomInfobox.download_url) {
          return randomInfobox.download_url;
        } else {
          reject("failed to fetch infobox.");
        }
      })
      .then(url => {
        fetch(url)
          .then(response => {
            return response.text();
          })
          .then(markdown => {
            setTimeout(() => {
              // hack until I find a better event to call this on
              var infoBox = document.createElement("div");
              infoBox.className =
                "jupyterlab-infoboxes p-Widget jp-Cell jp-CodeCell jp-RenderedHTMLCommon jp-RenderedMarkdown";
              infoBox.innerHTML = converter.makeHtml(markdown);
              infoBox.style.backgroundColor = "#edf4ff";
              infoBox.style.borderColor = "#0062ff";
              infoBox.style.borderWidth = "2px";
              infoBox.style.borderStyle = "solid";
              resolve(infoBox);
            }, 300);
          });
      })
      .catch(error => {
        console.error(error);
      });
  });
}

function isEmptyNotebook(notebook: any): boolean {
  return notebook.content.model.cells.length < 2;
}

/**
 * Initialization data for the jupyterlab-infoboxes extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: "jupyterlab-infoboxes",
  autoStart: true,
  requires: [INotebookTracker],
  activate: (app: JupyterFrontEnd, notebookTracker: INotebookTracker) => {
    // on startup, notebooks may already be open
    notebookTracker.forEach(notebook => {
      if (notebook.node.classList.contains("has-jupyterlab-infoboxes")) {
        return;
      } else {
        notebook.node.classList.add("has-jupyterlab-infoboxes");
        createInfoBox().then(infoBox => {
          if (isEmptyNotebook(notebook)) {
            return;
          }
          notebook.node.childNodes[1].appendChild(infoBox);
        });
      }
    });

    // handle new notebooks being opened
    notebookTracker.widgetAdded.connect(tracker => {
      tracker.forEach(notebook => {
        if (notebook.node.classList.contains("has-jupyterlab-infoboxes")) {
          return;
        } else {
          notebook.node.classList.add("has-jupyterlab-infoboxes");
          createInfoBox().then(infoBox => {
            if (isEmptyNotebook(notebook)) {
              return;
            }

            var insertionPoint = Math.floor(
              (<Element>notebook.node.childNodes[1]).children.length / 2
            );
            while (
              insertionPoint <
                (<Element>notebook.node.childNodes[1]).children.length &&
              !cellIsATitle(
                (<Element>notebook.node.childNodes[1]).children[insertionPoint]
              )
            ) {
              insertionPoint++;
            }
            if (
              insertionPoint ===
              (<Element>notebook.node.childNodes[1]).children.length
            ) {
              insertionPoint = 0;
            } // display at the beginning by default if we couldn't find a good spot
            notebook.node.childNodes[1].insertBefore(
              infoBox,
              (<Element>notebook.node.childNodes[1]).children[insertionPoint]
            );
          });
        }
      });
    });
  }
};

export default extension;
