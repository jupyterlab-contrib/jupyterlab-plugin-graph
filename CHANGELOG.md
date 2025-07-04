# Changelog

<!-- <START NEW CHANGELOG ENTRY> -->

## 0.3.0

### Features

- Support for JupyterLab 4.x [#39](https://github.com/jupyterlab-contrib/jupyterlab-plugin-graph/issues/39)

### Breaking Changes

- Minimum JupyterLab version is now 4.0 (previously 2.0)

### Maintenance and upkeep improvements

- Update all dependencies to JupyterLab 4.x compatible versions
- Migrate from private `_pluginMap` API to hybrid public/private approach
- Fix TypeScript compilation issues with newer versions
- Update React types to v18
- Replace `jlpm` with `yarn` in build scripts
- Add proper TypeScript lib configuration for modern JavaScript features

### Developer improvements

- Add `skipLibCheck` to TypeScript configuration for better compatibility
- Fix ESLint/Prettier formatting issues
- Improve plugin metadata extraction with fallback mechanism

<!-- <END NEW CHANGELOG ENTRY> -->

## 0.2.1

([Full Changelog](https://github.com/jupyterlab-contrib/jupyterlab-plugin-graph/compare/0.2.0...0023aa04765b20cccd4b23787c23d047081781e0))

### Maintenance and upkeep improvements

- Update links after transfer [#20](https://github.com/jupyterlab-contrib/jupyterlab-plugin-graph/pull/20) ([@jtpio](https://github.com/jtpio))
- Update dependencies, switch to `jupyter-packaging` 0.10, adopt the releaser [#18](https://github.com/jupyterlab-contrib/jupyterlab-plugin-graph/pull/18) ([@jtpio](https://github.com/jtpio))

### Other merged PRs

- Bump ssri from 8.0.0 to 8.0.1 [#8](https://github.com/jupyterlab-contrib/jupyterlab-plugin-graph/pull/8) ([@dependabot](https://github.com/dependabot))
- Bump ini from 1.3.5 to 1.3.8 [#7](https://github.com/jupyterlab-contrib/jupyterlab-plugin-graph/pull/7) ([@dependabot](https://github.com/dependabot))

### Contributors to this release

([GitHub contributors page for this release](https://github.com/jupyterlab-contrib/jupyterlab-plugin-graph/graphs/contributors?from=2020-11-09&to=2021-09-21&type=c))

[@dependabot](https://github.com/search?q=repo%3Ajupyterlab-contrib%2Fjupyterlab-plugin-graph+involves%3Adependabot+updated%3A2020-11-09..2021-09-21&type=Issues) | [@jtpio](https://github.com/search?q=repo%3Ajupyterlab-contrib%2Fjupyterlab-plugin-graph+involves%3Ajtpio+updated%3A2020-11-09..2021-09-21&type=Issues)

<!-- <END NEW CHANGELOG ENTRY> -->

## 0.2.0

### Changes

- Support for JupyterLab 3.0
- Adopt the new distribution system
