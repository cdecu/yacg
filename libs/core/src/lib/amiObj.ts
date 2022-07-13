import { AmiPropr } from "./amiPropr";
import { intfModel } from "./intfModel";
import { intfPropr } from "./intfPropr";
import { intfObjInfo } from "./intfObj";

/**
 * Object Abstract Info
 * an Object is (for us) just a list of properties
 */
export class AmiObj<AMI> implements intfObjInfo<AMI> {
  public properties: AmiPropr<AMI>[] = [];
  public sampleSize = 0;

  /**
   * Just initialize name,type
   */
  constructor(public readonly ami: intfModel<AMI>, public name: string, public description: string = "") {}

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
  public addSampleProperty(key: string, val: unknown): intfPropr<AMI> {
    const found = this.properties.find((i) => i.name === key);
    if (found) {
      found.addSampleVal(val);
      return found;
    }
    const newOne = new AmiPropr<AMI>(this.ami, this, key);
    this.properties.push(newOne);
    newOne.addSampleVal(val);
    return newOne;
  }

  /**
   * Detect properties type from sample values
   */
  public detectTypes() {
    this.properties.forEach((prop) => prop.detectType());
  }
}
