# jupyterlab-plugin-graph

![Github Actions Status](https://github.com/jtpio/jupyterlab-plugin-graph/workflows/Build/badge.svg)[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/jtpio/jupyterlab-plugin-graph/master?urlpath=lab)

JupyterLab extension to show a dependency graph of all the available plugins.

![screencast](https://user-images.githubusercontent.com/591645/88682890-7eba7280-d0f3-11ea-8cd0-0d6ef6ccd841.gif)

## Requirements

* JupyterLab >= 2.0

## Install

```bash
jupyter labextension install jupyterlab-plugin-graph
```

## Scope

This extension is mostly useful to JupyterLab developers who are developing a new extension, and want to double check the dependencies between the plugins.

But it can also be of interest to other folks interested in the inner workings of the whole JupyterLab application.

Additionally, this extension can be used in a pure Lumino application as well.

## Contributing

### Install

The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` in lieu of `jlpm` below.

```bash
# Clone the repo to your local environment
# Move to jupyterlab-plugin-graph directory

# Install dependencies
jlpm
# Build Typescript source
jlpm build
# Link your development version of the extension with JupyterLab
jupyter labextension install .
# Rebuild Typescript source after making changes
jlpm build
# Rebuild JupyterLab after making any changes
jupyter lab build
```

You can watch the source directory and run JupyterLab in watch mode to watch for changes in the extension's source and automatically rebuild the extension and application.

```bash
# Watch the source directory in another terminal tab
jlpm watch
# Run jupyterlab in watch mode in one terminal tab
jupyter lab --watch
```

Now every change will be built locally and bundled into JupyterLab. Be sure to refresh your browser page after saving file changes to reload the extension (note: you'll need to wait for webpack to finish, which can take 10s+ at times).

### Uninstall

```bash
jupyter labextension uninstall jupyterlab-plugin-graph
```
