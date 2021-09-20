import {
  MainAreaWidget,
  ReactWidget,
  Toolbar,
  UseSignal,
} from '@jupyterlab/apputils';

import { InputGroup } from '@jupyterlab/ui-components';

import { Widget } from '@lumino/widgets';

import cytoscape from 'cytoscape';

import React, { useState } from 'react';

import { Model } from './model';
import { Signal, ISignal } from '@lumino/signaling';

class Graph extends Widget {
  constructor(model: Model) {
    super();
    this._model = model;
    this._model.filterChanged.connect(() => this.update());
  }

  /**
   * Return the number of nodes.
   */
  get V(): number {
    return this._V;
  }

  /**
   * Return the number of edges.
   */
  get E(): number {
    return this._E;
  }

  /**
   * A signal emitted when the widget is updated.
   */
  get updated(): ISignal<Graph, void> {
    return this._updated;
  }

  update(): void {
    const { plugins, filter, requires, optional } = this._model;
    const nodes: Array<cytoscape.NodeDefinition> = [];
    const edges: Array<cytoscape.EdgeDefinition> = [];

    Object.keys(plugins).forEach((id) => {
      let label = id;
      if (plugins[id].provides) {
        label = plugins[id].provides.name;
      }

      const match = (name: string): boolean =>
        filter === '' || !!name.toLowerCase().match(filter.toLowerCase());
      const addNode = (name: string): void => {
        nodes.push({ data: { id: name, name } });
      };

      if (match(label)) {
        addNode(label);
      }

      if (requires) {
        ((plugins[id].requires as Array<any>) ?? []).forEach((p) => {
          if (!match(p.name) && !match(label)) {
            return;
          }
          addNode(p.name);
          addNode(label);
          edges.push({
            data: {
              source: label,
              target: p.name,
            },
            style: {
              'line-style': 'solid',
              'line-color': '#F5A636',
            },
            classes: 'top-center',
          });
        });
      }

      if (optional) {
        ((plugins[id].optional as Array<any>) ?? []).forEach((p) => {
          if (!match(p.name) && !match(label)) {
            return;
          }
          addNode(p.name);
          addNode(label);
          edges.push({
            data: {
              source: label,
              target: p.name,
            },
            style: {
              'line-style': 'dashed',
              'line-color': '#0072B3',
            },
            classes: 'top-center',
          });
        });
      }
    });

    const layout = (): cytoscape.LayoutOptions => {
      const ns = new Set<string>();
      nodes.forEach((n: cytoscape.NodeDefinition) => {
        ns.add(n.data.name);
      });
      if (ns.size >= 50) {
        return {
          name: 'circle',
          nodeDimensionsIncludeLabels: true,
          padding: 5,
          spacingFactor: 0.1,
          avoidOverlap: true,
        };
      }
      return {
        name: 'concentric',
        nodeDimensionsIncludeLabels: true,
        spacingFactor: 0.5,
        avoidOverlap: true,
      };
    };

    this._cy = cytoscape({
      layout: layout(),
      container: this.node,
      elements: {
        nodes,
        edges,
      },
      style: [
        {
          selector: 'node',
          style: {
            width: 'label',
            shape: 'rectangle',
            content: 'data(name)',
            'padding-bottom': '10px',
            'text-valign': 'center',
            'background-color': '#81bc00',
            'background-opacity': 0.4,
            'border-width': 1,
            'border-color': 'black',
          },
        },
        {
          selector: 'edge',
          style: {
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle',
          },
        },
      ],
    });

    this._V = this._cy.nodes().length;
    this._E = this._cy.edges().length;

    this._updated.emit(void 0);
  }

  protected onResize(): void {
    if (this._cy) {
      this._cy.resize();
      this._cy.fit();
    }
  }

  private _model: Model;
  private _cy: cytoscape.Core;
  private _V = 0;
  private _E = 0;
  private _updated = new Signal<this, void>(this);
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
          onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
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
          onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
            model.optional = event.target.checked;
          }}
        />
        Optional
      </label>
    );
    this.toolbar.addItem('optional', optional);

    this.toolbar.addItem('spacer', Toolbar.createSpacerItem());

    const nodes = ReactWidget.create(
      <UseSignal signal={this.content.updated}>
        {(): JSX.Element => (
          <div style={{ marginRight: '5px' }}>{this.content.V} plugins</div>
        )}
      </UseSignal>
    );
    this.toolbar.addItem('nodes', nodes);

    const edges = ReactWidget.create(
      <UseSignal signal={this.content.updated}>
        {(): JSX.Element => (
          <div style={{ marginRight: '5px' }}>{this.content.E} connections</div>
        )}
      </UseSignal>
    );
    this.toolbar.addItem('edges', edges);
  }
}

export namespace GraphContainer {
  export interface IOptions {
    model: Model;
  }
}
