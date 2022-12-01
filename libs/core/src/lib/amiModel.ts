import { AmiObj } from "./amiObj";
import { propertyType, valType } from "./amiUtils";
import { logHelper } from "./intfLogger";
import { ConfigIntf, InputFileIntf } from "./amiConfig";

/**
 * Abstract Model Info
 */
export class AmiModel {
  public src!: InputFileIntf;
  public name = "";
  public description = "";
  public sampleSize = 0;
  public addExamples = true;
  public readonly rootObj: AmiObj;
  public readonly childObjs: AmiObj[] = [];
  private json: any[] = [];

  /**
   * Abstract Model Info constructor
   */
  constructor(public readonly config: ConfigIntf, public readonly cliLogger: logHelper) {
    this.rootObj = new AmiObj(this, this);
  }

  /**
   * Load from a JSON Map or Array
   * @param {InputFileIntf} f
   * */
  public loadFromJSON(f: InputFileIntf): void {
    this.src = f;
    this.name = f.intfName;
    this.description = f.intfDescr;
    this.rootObj.clear(this.name, this.description);

    this.childObjs.length = 0;
    this.childObjs.push(this.rootObj);

    this.sampleSize = 0;
    this.json.length = 0;

    if (Array.isArray(this.src.json)) {
      this.sampleSize = this.src.json.length;
      this.rootObj.sampleSize = this.sampleSize;
      if (!this.sampleSize) throw "Empty Array";
      this.json = this.src.json;
    } else if (typeof this.src.json === "object") {
      this.rootObj.sampleSize = 1;
      this.json.push(this.src.json);
      this.sampleSize = 1;
    } else {
      // invalid JSON
      throw "Unsupported Source JSON";
    }

    if (this.json.length === 0) throw "Empty Source JSON";

    this.parseJSON();
  }

  /**
   * Add all object entries as property
   */
  private parseJSON(): void {
    // loop on source JSON
    this.json.forEach((j) => {
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
        // Remove trailing "s"
        const elName = propr.name.replace(/s$/, "");
        // recurse on child object
        const o = this.addObjMapPropr(propr.owner, `${propr.owner.name}.${elName}`);
        Object.entries(val).forEach(([key, val]) => this.addObjPropr(o, key, val));
        propr.mapAmiObj = o;
        break;
      case propertyType.otList:
        // recurse on array item object
        const a = val as Array<any>;
        a.forEach((item) => {
          const itemType = valType(item);
          switch (itemType) {
            case propertyType.otMap:
              // Remove trailing "s"
              const elName = propr.name.replace(/s$/, "");
              const o = this.addObjMapPropr(propr.owner, `${propr.owner.name}.${elName}`);
              Object.entries(item).forEach(([key, val]) => this.addObjPropr(o, key, val));
              propr.listAmiObj = o;
              break;
            default:
              propr.listTypes.add(itemType);
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
  private addObjMapPropr(owner: AmiObj, name: string): AmiObj {
    const found = this.childObjs.find((i) => i.name === name);
    if (found) {
      found.sampleSize += 1;
      return found;
    }

    const childObject = new AmiObj(this, owner, name, "");
    this.childObjs.push(childObject);
    return childObject;
  }
}
