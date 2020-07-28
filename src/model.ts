import { ISignal, Signal } from '@lumino/signaling';

export class Model {
  constructor(options: Model.IOptions) {
    this._plugins = options.plugins;
  }

  get plugins(): any {
    return this._plugins;
  }

  get filter(): string {
    return this._filter;
  }

  set filter(filter: string) {
    this._filter = filter;
    this._filterChanged.emit(void 0);
  }

  get requires(): boolean {
    return this._requires;
  }

  set requires(requires: boolean) {
    this._requires = requires;
    this._filterChanged.emit(void 0);
  }

  get optional(): boolean {
    return this._optional;
  }

  set optional(optional: boolean) {
    this._optional = optional;
    this._filterChanged.emit(void 0);
  }

  get filterChanged(): ISignal<Model, void> {
    return this._filterChanged;
  }

  private _plugins: any;
  private _filter = '';
  private _requires = true;
  private _optional = true;
  private _filterChanged = new Signal<this, void>(this);
}

namespace Model {
  export interface IOptions {
    plugins: any;
  }
}
