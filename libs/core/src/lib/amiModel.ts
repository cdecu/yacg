import { intfObjInfo } from "./intfObj";
import { AmiObj } from "./amiObj";
import { intfPropr } from "./intfPropr";

/**
 * Abstract Model Info
 */
export class AmiModel {
  public readonly ami: AmiModel;
  public readonly rootIntf: intfObjInfo<AmiModel>;
  public readonly childIntfs: intfObjInfo<AmiModel>[] = [];
  public sampleSize = 0;

  /**
   * Abstract Model Info constructor
   */
  constructor(public name = "MyIntf", public description = "") {
    this.ami = this;
    this.rootIntf = new AmiObj(this.ami, name, description);
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
      if (!this.sampleSize) throw "Empty Array";
      json.forEach((i) => this.parseJSON(i));
      this.rootIntf.detectTypes();
      return;
    }
    if (typeof json === "object") {
      // this.logger?.log('load Sample');
      this.rootIntf.sampleSize = 1;
      this.sampleSize = 1;
      this.parseJSON(json);
      this.rootIntf.detectTypes();
      return;
    }
    throw "Unsupported JSON";
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
   * @returns {AmiObj}
   * @param prop
   */
  public addPropr(prop: intfPropr<AmiModel>): intfObjInfo<AmiModel> {
    console.log("addPropr", prop.owner.name, prop.name);

    const childObject = new AmiObj<AmiModel>(this.ami, `${prop.owner.name}.${prop.name}`, prop.description);
    this.childIntfs.push(childObject);
    return childObject;
  }
}
