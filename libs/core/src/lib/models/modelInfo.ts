import {modelInfo, propertyInfo} from '@yacg/core';
import {IntfObjInfo} from './intfInfo';

/**
 * Abstract Model Info
 */
export class ModelInfo implements modelInfo {
  public readonly rootIntf: IntfObjInfo;
  public readonly childIntfs: IntfObjInfo[] = [];
  public sampleSize = 0;

  /**
   * Abstract Model Info constructor
   */
  constructor(public name = 'MyIntf', public description = '') {
    this.rootIntf = new IntfObjInfo(name, description);
  }

  /**
   * Load from a JSON Map or Array
   * @param name
   * @param description
   * @param json
   */
  public loadFromJSON(name: string, description: string, json: any): void {
    this.name = name;
    this.description = description;
    this.rootIntf.clear(name, description);
    this.childIntfs.length = 0;
    this.sampleSize = 0;
    this.loadJSON(json);
  }

  /**
   * Load from a JSON Map or Array
   * @param json
   */
  public loadJSON(json: any): void {
    if (Array.isArray(json)) {
      // this.logger?.log(`load Sample Array of ${json.length}`);
      this.sampleSize = json.length;
      this.rootIntf.sampleSize = this.sampleSize;
      if (!this.sampleSize) throw 'Empty Array';
      json.forEach((i) => this.parseJSON(i));
      this.rootIntf.detectTypes(this);
      return;
    }
    if (typeof json === 'object') {
      // this.logger?.log('load Sample');
      this.rootIntf.sampleSize = 1;
      this.sampleSize = 1;
      this.parseJSON(json);
      this.rootIntf.detectTypes(this);
      return;
    }
    throw 'Unsupported JSON';
  }

  /**
   * Add all object entries as property
   * @param json
   */
  public parseJSON(json: any): void {
    Object.entries(json).forEach(([key, val]) => this.rootIntf.addSampleProperty(key, val));
  }

  /**
   * add Child Object needed by subtype
   * @returns {IntfObjInfo}
   * @param prop
   */
  public addChildObject(prop: propertyInfo): IntfObjInfo {
    const childObject = new IntfObjInfo(`${this.rootIntf.name}.${prop.name}`, prop.description);
    this.childIntfs.push(childObject);
    return childObject;
  }
}
