import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the jupyterlab-plugin-graph extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-plugin-graph',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupyterlab-plugin-graph is activated!');
  }
};

export default extension;
