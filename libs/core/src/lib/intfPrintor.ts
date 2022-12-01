import type { AmiModel } from "./amiModel";
import { AmiObj } from "./amiObj";
import { ConfigIntf } from "./amiConfig";
import { AmiPropr } from "./amiPropr";
import { capitalizeFirstLetter, isPrimitive, propertyType } from "./amiUtils";

/**
 * Abstract Model Printor
 */
export interface intfModelPrintor {
  readonly ami: AmiModel;
  readonly config: object;
  readonly fileExt: string;
  readonly outputFmt: string;

  /**
   * printModel return the typescript code declaring ...
   * @param {AmiModel} model
   * @returns {string}
   */
  printModel: () => string;
}

/**
 * Base Model Printor Class
 */
export class IntfModelPrintor {
  fileExt!: string;
  outputFmt!: string;
  /**
   * prepared "scope" used to fill the Handlebars Template
   */
  scope?: any;

  /**
   * Constructor
   * @param ami
   * @param config
   */
  constructor(public readonly ami: AmiModel, public readonly config: ConfigIntf) {}

  //region Template Helpers
  /**
   * Format Description
   */
  public static JDocDescr(indent: number, val: string): string | null {
    if (!val) return null;
    const lines = val.split("\n");
    const prefix = " ".repeat(indent);
    if (lines.length > 1) {
      let descr = prefix + "/**\n";
      lines.forEach((l) => (descr += prefix + l + "\n"));
      descr += prefix + " */\n";
      return descr;
    }
    return prefix + "/* " + val + " */\n";
  }

  /**
   * Format Description
   */
  public static DelphiDescr(indent: number, val1: string, val2: string): string | null {
    if (!val2) return null;
    const lines = val2.split("\n");
    const prefix = " ".repeat(indent);
    if (lines.length > 1) {
      let descr = prefix + "/// <" + val1 + ">\n";
      lines.forEach((l) => (descr += prefix + "/// " + l + "\n"));
      descr += prefix + "/// </" + val1 + ">";
      return descr;
    }
    return prefix + "/// <" + val1 + ">" + val2 + "</" + val1 + ">";
  }

  //endregion

  //region Pascal Helpers
  public static buildPascalObjName(value: string): string {
    const intfName = value.replaceAll(/[." -]/g, "_").replaceAll(/___|__/g, "_");
    return capitalizeFirstLetter(intfName);
  }

  public static buildPascalTypeName(value: string): string {
    return "T" + IntfModelPrintor.buildPascalObjName(value);
  }

  public static buildPascalObjProprName(value: string): string {
    return value.replaceAll(/[." -]/g, "_").replaceAll(/___|__/g, "_");
  }

  public buildPropertyPascalType(propr: AmiPropr, isElem: boolean = false): string {
    if (propr.sampleTypes.size === 1) {
      switch (propr.type) {
        case propertyType.otBigInt:
          return "int64";
        case propertyType.otFloat:
          return "extended";
        case propertyType.otInteger:
          return "integer";
        case propertyType.otString:
          return "string";
        case propertyType.otBoolean:
          return "boolean";
      }
    }

    if (propr.mapType instanceof AmiObj) {
      return IntfModelPrintor.buildPascalTypeName(propr.mapType.name);
    }

    if (propr.listTypes.size === 1) {
      const [i] = propr.listTypes;
      const typeName = IntfModelPrintor.buildPascalTypeName(i.name);
      return isElem ? typeName : typeName + "Array";
    }

    if (propr.listTypes.size > 1) {
      this.ami.cliLogger?.error(`Unknown type for property ${propr.name} in object ${propr.owner.name}`);
      return "Array of variant";
    }

    this.ami.cliLogger?.error(`Unknown type for property ${propr.name} in object ${propr.owner.name}`);
    return "variant";
  }

  public buildPascalProperties(o: AmiObj): unknown[] {
    return o.properties.map((propr) => {
      return {
        ...propr,
        proprName: IntfModelPrintor.buildPascalObjProprName(propr.name),
        typeName: this.buildPropertyPascalType(propr),
        elTypeName: this.buildPropertyPascalType(propr, true),
        fieldName: IntfModelPrintor.buildPascalObjName(o.name) + "_" + IntfModelPrintor.buildPascalObjProprName(propr.name),
        isPrimitive: propr.sampleTypes.size === 1 && isPrimitive(propr.type),
        asRef: propr.listTypes.size > 0,
        isMap: propr.mapType instanceof AmiObj,
        isArray: propr.listTypes.size > 0,
        isMultiArray: propr.listTypes.size > 1,
        examples: this.ami.addExamples ? propr.examples : "",
      };
    });
  }

  //endregion

  public finalizeScope(o: AmiObj): void {
    this.scope.ami_name = o.ami.name;
    this.scope.owner_name = o.owner.name;
    this.scope.isRoot = o.ami === o.owner;
    this.scope.requiredProperties = this.scope.properties.filter((p: any) => p.required);
    if (!this.scope.description) {
      this.scope.description ??= this.ami.name == o.name ? this.ami.description ?? this.config["description"] ?? "" : "";
    }
  }
}
