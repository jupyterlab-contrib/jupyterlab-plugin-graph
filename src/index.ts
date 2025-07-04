import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';

import { ICommandPalette } from '@jupyterlab/apputils';

import { buildIcon } from '@jupyterlab/ui-components';

import { Model } from './model';

import { GraphContainer } from './widget';

/**
 * Create a plugins map using the public API
 */
function createPluginsMap(app: JupyterFrontEnd): any {
  const plugins: any = {};
  
  // Get all plugin IDs
  const pluginIds = app.listPlugins();
  
  // For each plugin, create a minimal structure
  // Note: We can't access the full plugin metadata through public APIs,
  // so we'll access the private _pluginMap as a fallback
  for (const id of pluginIds) {
    plugins[id] = {
      id,
      description: app.getPluginDescription(id),
      activated: app.isPluginActivated(id),
      // We'll need to access the private plugin map to get requires/optional/provides
      requires: [],
      optional: [],
      provides: null
    };
  }
  
  // Access the private plugin map for full metadata
  // This is a temporary workaround until JupyterLab provides a public API
  try {
    const privatePluginMap = (app as any)._pluginMap;
    if (privatePluginMap) {
      for (const id of pluginIds) {
        if (privatePluginMap[id]) {
          plugins[id].requires = privatePluginMap[id].requires || [];
          plugins[id].optional = privatePluginMap[id].optional || [];
          plugins[id].provides = privatePluginMap[id].provides || null;
        }
      }
    }
  } catch (error) {
    console.warn('Could not access plugin metadata:', error);
  }
  
  return plugins;
}

/**
 * Initialization data for the jupyterlab-plugin-graph extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-plugin-graph',
  autoStart: true,
  optional: [ICommandPalette],
  activate: (app: JupyterFrontEnd, palette: ICommandPalette | null) => {
    const { commands, shell } = app;
    app.restored.then(() => {
      const plugins = createPluginsMap(app);
      const model = new Model({ plugins });

      const command = 'jupyterlab-plugin-graph:open';
      commands.addCommand(command, {
        label: 'Plugin Dependency Graph',
        caption: 'Open the plugin dependency graph',
        execute: () => {
          const widget = new GraphContainer({ model });
          widget.title.label = 'Plugin Graph';
          widget.title.icon = buildIcon;
          shell.add(widget, 'main');
          widget.content.update();
        },
      });
      if (palette) {
        palette.addItem({ command, category: 'Developer' });
      }
    });
  },
};

export default extension;
