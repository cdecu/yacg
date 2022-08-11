import { AmiObj } from "./amiObj";
import { propertyType, valType } from "./amiUtils";

/**
 * Abstract Model Info
 */
export class AmiModel {
  public sampleSize = 0;
  public addExamples = true;
  public readonly rootObj: AmiObj;
  public readonly childObjs: AmiObj[] = [];
  private src: any[] = [];

  /**
   * Abstract Model Info constructor
   */
  constructor(public name = "MyIntf", public description = "") {
    this.rootObj = new AmiObj(this, name, description);
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
    this.rootObj.clear(name, description);

    this.childObjs.length = 0;
    this.childObjs.push(this.rootObj);

    this.sampleSize = 0;
    this.src.length = 0;

    if (Array.isArray(json)) {
      this.sampleSize = json.length;
      this.rootObj.sampleSize = this.sampleSize;
      if (!this.sampleSize) throw "Empty Array";
      this.src = json;
    } else if (typeof json === "object") {
      this.rootObj.sampleSize = 1;
      this.src.push(json);
      this.sampleSize = 1;
    } else {
      // invalid JSON
    }

    if (this.src.length === 0) throw "Unsupported Source JSON";

    this.parseJSON();
  }

  /**
   * Add all object entries as property
   */
  private parseJSON(): void {
    // loop on source JSON
    this.src.forEach((j) => {
      if (j !== undefined && j !== null && typeof j === "object") {
        Object.entries(j).forEach(([key, val]) => this.addObjPropr(this.rootObj, key, val));
      }
    });
    // Detect properties type from sample values
    this.childObjs.forEach((obj) => obj.properties.forEach((prop) => prop.detectType()));
  }

  /**
   * Add a child object to the model. This is the recursive part
   */
  private addObjPropr(obj: AmiObj, name: string, val: any): void {
    const propr = obj.addSampleProperty(name);
    propr.addSampleVal(val);

    switch (propr.type) {
      case propertyType.otMap:
        // recurse on child object
        const o = this.addObjMapPropr(`${propr.owner.name}.${propr.name}`);
        propr.mapType = o;
        Object.entries(val).forEach(([key, val]) => this.addObjPropr(o, key, val));
        break;
      case propertyType.otList:
        // recurse on array item object
        const a = val as Array<any>;
        a.forEach((item) => {
          switch (valType(item)) {
            case propertyType.otMap:
              const o = this.addObjMapPropr(`${propr.owner.name}.${propr.name}`);
              propr.listTypes.add(o);
              Object.entries(item).forEach(([key, val]) => this.addObjPropr(o, key, val));
              break;
            case propertyType.otList:
              break;
            default:
              break;
          }
        });
        break;
      default:
        break;
    }
  }

  /**
   * add Child Object needed by subtype
   */
  private addObjMapPropr(name: string): AmiObj {
    const found = this.childObjs.find((i) => i.name === name);
    if (found) {
      found.sampleSize += 1;
      return found;
    }

    const childObject = new AmiObj(this, name, "");
    this.childObjs.push(childObject);
    return childObject;
  }
}
