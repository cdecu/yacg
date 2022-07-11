import {intfObjInfo, isPrimitive, modelInfo, propertyInfo, propertyType, valType} from "./intfs";

/**
 * Object Property Abstract Info
 */
export class PropertyInfo implements propertyInfo {
  public type = propertyType.otUnknown;
  public subType!: PropertyInfo;
  public description = '';
  public required = true;
  public sampleTypes = new Set<propertyType>([]);
  public sampleValues = new Set<any>([]);
  private sampleSize = 0;

  /**
   * Just initialize name.
   * TODO I dont like to pass the logger everywhere but ...
   */
  constructor(public readonly name: string) {}

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
   * @returns {propertyInfo}
   */
  addSampleVal(val: any): propertyInfo {
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
  public detectType(model: modelInfo, owner: intfObjInfo) {
    //  Build description
    if (this.sampleValues.size > 0) {
      const examples = Array.from(this.sampleValues)
      .map((v) => JSON.stringify(v))
      .filter((v) => v != '""')
      .join(';');
      if (examples) {
        this.description += '@example ' + examples;
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
    if (this.sampleTypes.size === 1 && this.type === propertyType.otMap && model.addChildObject) {
      const o = model.addChildObject(this);
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
   * Try to find enum ex: CardColor : SPADE, HEART, DIAMOND, CLUB.
   * So type is converted to an Enum or a Type Alias.
   * @private
   */
  private detectEnumType(model: modelInfo, owner: intfObjInfo) {
    // this.logger?.log(`EnumType ${model.name}.${owner.name}.${this.name}`);
  }

  /**
   * Try to find union type like number | string
   * So type is converted to a Type Alias.
   * @private
   */
  private detectUnionType(model: modelInfo, owner: intfObjInfo) {
    // this.logger?.log(`UnionType ${model.name}.${owner.name}.${this.name}`);
  }

  /**
   * Extract list items type(s) from sampleValues
   * @param {modelInfo} model
   * @param {intfObjInfo} owner
   */
  public detectListSubType(model: modelInfo, owner: intfObjInfo) {
    // Build itemTypes Set
    const itemTypes = new Set<propertyType>([]);
    this.sampleValues.forEach((v: any[]) => v.forEach((i: any) => itemTypes.add(valType(i))));

    // Count Cplex itemTypes
    let cntCplex = 0;
    itemTypes.forEach((vt) => (cntCplex += isPrimitive(vt) ? 0 : 1));
    if (!cntCplex) {
      // Only Primitive types
      this.subType = new PropertyInfo(this.name + '.item');
      this.sampleValues.forEach((v: any[]) => v.forEach((i: any) => this.subType.addSampleVal(i)));
      return;
    }
    // List of Object ?
    // this.logger?.log(`List ${model.name}.${owner.name}.${this.name} SubType`);
    this.subType = new PropertyInfo(this.name + '.item');
  }
}
