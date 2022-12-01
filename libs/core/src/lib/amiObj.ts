import type { AmiModel } from "./amiModel";
import { AmiPropr } from "./amiPropr";

/**
 * Object Abstract Info
 * an Object is (for us) just a list of properties
 */
export class AmiObj {
  public properties: AmiPropr[] = [];
  public sampleSize = 1;

  /**
   * Just initialize name,type
   */
  constructor(public readonly ami: AmiModel, public readonly owner: AmiObj | AmiModel, public name: string = "", public description: string = "") {}

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
   */
  public addSampleProperty(key: string): AmiPropr {
    const found = this.properties.find((i) => i.name === key);
    if (found) {
      return found;
    }
    const newOne = new AmiPropr(this.ami, this, key);
    this.properties.push(newOne);
    return newOne;
  }
}
