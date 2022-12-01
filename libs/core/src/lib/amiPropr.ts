import { isPrimitive, propertyType, Str2Type, valType } from "./amiUtils";
import type { AmiObj } from "./amiObj";
import type { AmiModel } from "./amiModel";

/**
 * Object Property Abstract Info
 */
export class AmiPropr {
  public description = "";
  public examples = "";
  public required = true;
  public type = propertyType.otUnknown;
  public mapAmiObj?: AmiObj;
  public listAmiObj?: AmiObj;
  public listTypes = new Set<propertyType>([]);
  public sampleTypes = new Set<propertyType>([]);
  public sampleValues = new Set<any>([]);
  private sampleSize = 0;

  /**
   * Just initialize name.
   * TODO I dont like to pass the logger everywhere but ...
   */
  constructor(public readonly ami: AmiModel, public readonly owner: AmiObj, public readonly name: string) {}

  /**
   * only Primitive Types
   * @returns boolean
   */
  public onlyPrimitives(): boolean {
    let cntCplex = 0;
    this.sampleTypes.forEach((vt) => (cntCplex += isPrimitive(vt) ? 0 : 1));
    return !cntCplex;
  }

  /**
   * Add a Sample value the property. Detect the typeof
   */
  public addSampleVal(val: any): void {
    const vt = valType(val);
    switch (vt) {
      case propertyType.otNull:
        // console.log('Ignore null value');
        return;
      case propertyType.otList:
        if (val.length === 0) {
          // console.log('Ignore empty array',val);
          this.type = vt;
          this.sampleTypes.add(vt);
          this.sampleSize += 1;
          return;
        }
    }
    this.type = vt;
    this.sampleTypes.add(vt);
    this.sampleValues.add(val);
    this.sampleSize += 1;
  }

  /**
   * Detect type from sample values
   */
  public detectType() {
    //  Build examples
    if (this.sampleValues.size > 0) {
      const examples = Array.from(this.sampleValues)
        .map((v) => JSON.stringify(v))
        .filter((v) => v != '""')
        .filter((v) => v != "[]")
        .slice(0, 5)
        .join("\n");
      if (examples) {
        this.examples += examples;
      }
    }

    // clean types
    if (this.sampleTypes.has(propertyType.otFloat)) {
      this.sampleTypes.delete(propertyType.otInteger);
      this.sampleTypes.delete(propertyType.otBigInt);
      if (this.sampleTypes.size === 1) {
        this.type = this.sampleTypes.values().next().value;
      }
    }
    if (this.sampleTypes.has(propertyType.otBigInt)) {
      this.sampleTypes.delete(propertyType.otInteger);
      if (this.sampleTypes.size === 1) {
        this.type = this.sampleTypes.values().next().value;
      }
    }

    // Property is Required if always present
    this.required = this.sampleSize > 1 && this.ami.sampleSize === this.sampleSize;

    // Property has only one type
    if (this.sampleTypes.size === 0) {
      this?.ami?.cliLogger?.warn(`No sample values for ${this.owner.name}.${this.name}`);
      const dico = this.ami.config.dico[this.name];
      if (dico?.defaultType) {
        const vt = Str2Type(dico.defaultType);
        if (vt !== propertyType.otUnknown) {
          this.sampleTypes.add(vt);
          this.type = vt;
          return;
        }
      }
    }

    // Property has only one type
    if (this.sampleTypes.size === 1) {
      switch (this.type) {
        case propertyType.otList:
          this.detectListType();
          return;
        case propertyType.otMap:
          this.detectMapType();
          return;
        default:
          return;
      }
    }

    // Property is one or many Primitive type(s)
    if (this.onlyPrimitives()) {
      this.detectEnumType();
      return;
    } else {
      this.detectUnionType();
      return;
    }

    // Property has many types
    this.detectComplexTypes();
    return;
  }

  /**
   * Try to find enum ex: CardColor : SPADE, HEART, DIAMOND, CLUB.
   * So type is converted to an Enum or a Type Alias.
   */
  private detectEnumType() {
    // console.log(`EnumType ${this.ami.name}.${this.owner.name}.${this.name} : Type ${this.type}`);
  }

  /**
   * Try to find union type like number | string
   * So type is converted to a Type Alias.
   */
  private detectUnionType() {
    // console.log(`UnionType ${this.ami.name}.${this.owner.name}.${this.name} : Type ${this.type}`);
  }

  /**
   * Finalize list property
   */
  private detectListType() {
    // console.log("detectListType", this.name, this.sampleValues);
  }

  /**
   * Finalize map property
   */
  private detectMapType() {
    // console.log("detectMapType", this.name, this.sampleValues);
  }

  /**
   * Finalize complex property
   */
  private detectComplexTypes() {
    // console.log("detectMapType", this.name, this.sampleValues);
  }
}
