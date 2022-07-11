import { isPrimitive, valType } from "./amiUtils";
import { intfModel } from "./intfModel";
import { intfPropr, propertyType } from "./intfPropr";
import { intfObjInfo } from "./intfObj";

/**
 * Object Property Abstract Info
 */
export class AmiPropr<AMI> implements intfPropr<AMI> {
  public type = propertyType.otUnknown;
  public subType!: intfPropr<AMI>;
  public description = "";
  public required = true;
  public sampleTypes = new Set<propertyType>([]);
  public sampleValues = new Set<any>([]);
  private sampleSize = 0;

  /**
   * Just initialize name.
   * TODO I dont like to pass the logger everywhere but ...
   */
  constructor(public readonly ami: intfModel<AMI>, public readonly name: string) {}

  /**
   * Is Simple Type
   * @returns boolean
   */
  get simpleType(): boolean {
    return this.sampleTypes.size <= 1;
  }

  /**
   * only Primitive Types
   * @returns boolean
   */
  get onlyPrimitives(): boolean {
    let cntCplex = 0;
    this.sampleTypes.forEach((vt) => (cntCplex += isPrimitive(vt) ? 0 : 1));
    return !cntCplex;
  }

  /**
   * Add a Sample value the property. Detect the typeof
   * @param val
   * @returns {intfPropr}
   */
  addSampleVal(val: any): intfPropr<AMI> {
    const vt = valType(val);
    this.type ||= vt;
    this.sampleSize += 1;
    this.sampleTypes.add(vt);
    this.sampleValues.add(val);
    return this;
  }

  /**
   * Detect type from sample values
   */
  public detectType(model: intfModel<AMI>, owner: intfObjInfo<AMI>) {
    //  Build description
    if (this.sampleValues.size > 0) {
      const examples = Array.from(this.sampleValues)
        .map((v) => JSON.stringify(v))
        .filter((v) => v != '""')
        .join(";");
      if (examples) {
        this.description += "@example " + examples;
      }
    }

    // Required if always present
    this.required = model.sampleSize === this.sampleSize;

    // Count complex types (not primitive)
    let cntCplex = 0;
    this.sampleTypes.forEach((vt) => (cntCplex += isPrimitive(vt) ? 0 : 1));

    // Property is a Primitive type(s)
    if (!cntCplex) {
      if (this.sampleTypes.size === 1) {
        this.detectEnumType(model, owner);
      } else {
        this.detectUnionType(model, owner);
      }
      return;
    }

    // Property is a List
    if (this.sampleTypes.size === 1 && this.type === propertyType.otList) {
      // need to detect list elements type
      this.detectListSubType(model, owner);
      return;
    }

    // Property is a Map  {}
    if (this.sampleTypes.size === 1 && this.type === propertyType.otMap && model.addPropr) {
      const o = model.addPropr(this);
      o.sampleSize = this.sampleTypes.size;
      this.sampleValues.forEach((v: any) => {
        Object.entries(v).forEach(([key, val]) => {
          o.addSampleProperty(key, val);
        });
      });
      o.detectTypes(model);
      return;
    }

    // NO yet handled
    throw `Unsupported type ${model.name}.${owner.name}.${this.name}`;
  }

  /**
   * Extract list items type(s) from sampleValues
   * @param {intfModel} model
   * @param {intfObjInfo} owner
   */
  public detectListSubType(model: intfModel<AMI>, owner: intfObjInfo<AMI>) {
    // Build itemTypes Set
    const itemTypes = new Set<propertyType>([]);
    this.sampleValues.forEach((v: any[]) => v.forEach((i: any) => itemTypes.add(valType(i))));

    // Count Cplex itemTypes
    let cntCplex = 0;
    itemTypes.forEach((vt) => (cntCplex += isPrimitive(vt) ? 0 : 1));
    if (!cntCplex) {
      // Only Primitive types
      this.subType = new AmiPropr(this.ami, this.name + ".item");
      this.sampleValues.forEach((v: any[]) => v.forEach((i: any) => this.subType.addSampleVal(i)));
      return;
    }
    // List of Object ?
    // this.logger?.log(`List ${model.name}.${owner.name}.${this.name} SubType`);
    this.subType = new AmiPropr(this.ami, this.name + ".item");
  }

  /**
   * Try to find enum ex: CardColor : SPADE, HEART, DIAMOND, CLUB.
   * So type is converted to an Enum or a Type Alias.
   * @private
   */
  private detectEnumType(model: intfModel<AMI>, owner: intfObjInfo<AMI>) {
    // this.logger?.log(`EnumType ${model.name}.${owner.name}.${this.name}`);
  }

  /**
   * Try to find union type like number | string
   * So type is converted to a Type Alias.
   * @private
   */
  private detectUnionType(model: intfModel<AMI>, owner: intfObjInfo<AMI>) {
    // this.logger?.log(`UnionType ${model.name}.${owner.name}.${this.name}`);
  }
}
