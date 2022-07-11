import { PropertyInfo } from './propInfo';
import {intfObjInfo, modelInfo, propertyInfo} from '@yacg/core';

/**
 * Object Abstract Info
 * an Object is (for us) just a list of properties
 */
export class IntfObjInfo implements intfObjInfo {
  public properties: PropertyInfo[] = [];
  public sampleSize = 0;

  /**
   * Just initialize name,type
   */
  constructor(public name: string,public description: string='') {}

  /**
   * Clear
   */
  public clear(name: string, description: string): void {
    this.name = name;
    this.description = description;
    this.properties.length = 0;
    this.sampleSize = 0;
  }

  /**
   * Add or update a property from sample value
   * @param key
   * @param val
   */
  public addSampleProperty(key: string, val: unknown): propertyInfo {
    const found = this.properties.find((i) => i.name === key);
    if (found) {
      found.addSampleVal(val);
      return found;
    }
    const newOne = new PropertyInfo(key);
    this.properties.push(newOne);
    newOne.addSampleVal(val);
    return newOne;
  }

  /**
   * Detect properties type from sample values
   */
  public detectTypes(model: modelInfo) {
    this.properties.forEach((prop) => prop.detectType(model, this));
  }
}
