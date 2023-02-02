import * as Handlebars from "handlebars";
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
  constructor(public readonly ami: AmiModel, public readonly config: ConfigIntf) {
    Handlebars.registerHelper("Indent", (indent: number) => " ".repeat(indent));
    Handlebars.registerHelper("Fill", (val: string, indent: number) => (indent > val.length ? val + " ".repeat(indent - val.length) : val));
    Handlebars.registerHelper("json", (context) => JSON.stringify(context, null, 2));
  }

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
      lines.forEach((l) => (descr += prefix + "/// " + l.substring(1, 256) + "\n"));
      descr += prefix + "/// </" + val1 + ">";
      return descr;
    }
    return prefix + "/// <" + val1 + ">" + val2 + "</" + val1 + ">";
  }

  //endregion

  //region Pascal Helpers
  //endregion

  //region Pascal Helpers
  public static PascalType(type: propertyType): string {
    switch (type) {
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
      default:
        return "variant";
    }
  }

  public static PascalCompareFct(type: propertyType): string {
    switch (type) {
      case propertyType.otBigInt:
      case propertyType.otFloat:
      case propertyType.otInteger:
      case propertyType.otBoolean:
        return "CompareValue";
      case propertyType.otString:
        return "CompareStr";
      default:
        return "CompareVariant";
    }
  }

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

  public buildPascalObjProprTypeName(propr: AmiPropr, isElem: boolean = false): string {
    if (propr.sampleTypes.size === 1) {
      switch (propr.type) {
        case propertyType.otBigInt:
        case propertyType.otFloat:
        case propertyType.otInteger:
        case propertyType.otString:
        case propertyType.otBoolean:
          return IntfModelPrintor.PascalType(propr.type);
      }
    }

    if (propr.mapAmiObj instanceof AmiObj) {
      return IntfModelPrintor.buildPascalTypeName(propr.mapAmiObj.name);
    }

    if (propr.listAmiObj instanceof AmiObj) {
      const typeName = IntfModelPrintor.buildPascalTypeName(propr.listAmiObj.name);
      const arrayTypeName = typeName + "Array";
      return isElem ? typeName : arrayTypeName;
    }

    if (propr.listTypes.size === 1) {
      const [type] = propr.listTypes;
      const typeName = IntfModelPrintor.PascalType(type);
      const arrayTypeName = IntfModelPrintor.buildPascalTypeName(propr.name) + "ArrayOf" + capitalizeFirstLetter(typeName);
      return isElem ? typeName : arrayTypeName;
    }

    if (propr.type === propertyType.otList) {
      this.ami.cliLogger?.error(`** ${propr.owner.name}.${propr.name} Array of Variant (listTypes:${propr.listTypes.size})`);
      const typeName = IntfModelPrintor.PascalType(propertyType.otUnknown);
      const arrayTypeName = IntfModelPrintor.buildPascalTypeName(propr.name) + "ArrayOf" + capitalizeFirstLetter(typeName);
      return isElem ? typeName : arrayTypeName;
    }

    this.ami.cliLogger?.error(`** ${propr.owner.name}.${propr.name} Variant (sampleTypes:${propr.sampleTypes.size})`);
    return "variant";
  }

  public buildPascalProperties(o: AmiObj): unknown[] {
    return o.properties.map((propr) => {
      console.assert(propr.mapAmiObj instanceof AmiObj === (propr.type === propertyType.otMap), "Invalid otMap");
      const objName = IntfModelPrintor.buildPascalObjName(o.name);
      const proprName = IntfModelPrintor.buildPascalObjProprName(propr.name);
      const fieldName = objName + "_" + proprName;
      return {
        ...propr,
        objName: objName,
        fieldName: fieldName,
        proprName: proprName,
        typeName: this.buildPascalObjProprTypeName(propr),
        elTypeName: this.buildPascalObjProprTypeName(propr, true),
        isPrimitive: propr.sampleTypes.size === 1 && isPrimitive(propr.type),
        isAmiObj: propr.mapAmiObj instanceof AmiObj,
        isArray: propr.type === propertyType.otList,
        isArrayOfAmiObj: propr.listAmiObj instanceof AmiObj,
        asConstRef: propr.mapAmiObj instanceof AmiObj || propr.listAmiObj instanceof AmiObj,
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
