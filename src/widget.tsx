import { MainAreaWidget, ReactWidget } from '@jupyterlab/apputils';

import { InputGroup } from '@jupyterlab/ui-components';

import { Widget } from '@lumino/widgets';

import cytoscape from 'cytoscape';

// @ts-ignore
import cola from 'cytoscape-cola';

// @ts-ignore
import popper from 'cytoscape-popper';

// @ts-ignore
import dagre from 'cytoscape-dagre';

// @ts-ignore
import klay from 'cytoscape-klay';

// @ts-ignore
import cise from 'cytoscape-cise';

import React, { useState } from 'react';

import { Model } from './model';

cytoscape.use(cola);
cytoscape.use(popper);
cytoscape.use(dagre);
cytoscape.use(klay);
cytoscape.use(cise);

class Graph extends Widget {
  constructor(model: Model) {
    super();
    this._model = model;
    this._model.filterChanged.connect(() => this.update());
  }

  update(): void {
    const { plugins, filter, requires, optional } = this._model;
    const nodes: Array<cytoscape.NodeDefinition> = [];
    const edges: Array<cytoscape.EdgeDefinition> = [];

    Object.keys(plugins).forEach(id => {
      let label = id;
      if (plugins[id].provides) {
        label = plugins[id].provides.name;
      }

      const match = (name: string) => filter === '' || name.toLowerCase().match(filter.toLowerCase());
      const addNode = (name: string) =>
        nodes.push({ data: { id: name, name } });

      if (match(label)) {
        addNode(label);
      }

      if (requires) {
        (plugins[id].requires as Array<any> ?? []).forEach(p => {
          if (!match(p.name) && !match(label)) {
            return;
          }
          addNode(p.name);
          addNode(label);
          edges.push({
            data: {
              source: label,
              target: p.name
            },
            style: {
              'line-style': 'solid'
            },
            classes: 'top-center'
          });
        });
      }

      if (optional) {
        (plugins[id].optional as Array<any> ?? []).forEach(p => {
          if (!match(p.name) && !match(label)) {
            return;
          }
          addNode(p.name);
          addNode(label);
          edges.push({
            data: {
              source: label,
              target: p.name
            },
            style: {
              'line-style': 'dashed'
            },
            classes: 'top-center'
          });
        });
      }
    });

    const layout = () => {
      const ns = new Set<string>();
      nodes.forEach((n: cytoscape.NodeDefinition) => {
        ns.add(n.data.name);
      });
      if (ns.size >= 50) {
        return {
          name: 'circle',
          nodeDimensionsIncludeLabels: false,
          padding: 0,
          spacingFactor: 0.1,
          avoidOverlap: true
        };
      }
      return {
        name: 'concentric',
        nodeDimensionsIncludeLabels: false,
        avoidOverlap: true
      };
    }

    this._cy = cytoscape({
      layout: layout(),
      container: this.node,
      elements: {
        nodes,
        edges
      },
      style: [
        {
          selector: 'node',
          style: {
            width: 'label',
            shape: 'rectangle',
            content: 'data(name)',
            'text-valign': 'center',
            'background-color': '#81bc00'
          }
        },
        {
          selector: 'edge',
          style: {
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle'
          }
        }
      ]
    });
  }

  protected onResize(): void {
    if (this._cy) {
      this._cy.resize();
      this._cy.fit();
    }
  }

  private _model: Model;
  private _cy: cytoscape.Core;
}

const FilterComponent = (props: { model: Model }): JSX.Element => {
  const { model } = props;
  const [value, setValue] = useState(model.filter);

  const handleFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const filter = event.target.value;
    setValue(filter);
    model.filter = filter;
  };

  return (
    <InputGroup
      className="filter"
      type="text"
      placeholder="Filter..."
      onChange={handleFilterChange}
      value={value}
    />
  );
};

export class GraphContainer extends MainAreaWidget<Graph> {
  constructor(options: GraphContainer.IOptions) {
    super({ content: new Graph(options.model) });

    const model = options.model;

    const widget = ReactWidget.create(<FilterComponent model={model} />);
    this.toolbar.addItem('filter', widget);

    const requires = ReactWidget.create(
      <label>
        <input
          style={{ verticalAlign: 'middle' }}
          name="requires"
          type="checkbox"
          defaultChecked={true}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            model.requires = event.target.checked;
          }}
        />
        Requires
      </label>
    );
    this.toolbar.addItem('requires', requires);

    const optional = ReactWidget.create(
      <label>
        <input
          style={{ verticalAlign: 'middle' }}
          name="optional"
          type="checkbox"
          defaultChecked={true}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            model.optional = event.target.checked;
          }}
        />
        Optional
      </label>
    );
    this.toolbar.addItem('optional', optional);
  }
}

export namespace GraphContainer {
  export interface IOptions {
    model: Model;
  }
}
