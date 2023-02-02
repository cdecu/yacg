import * as Handlebars from "handlebars";
import { IntfModelPrintor, intfModelPrintor } from "./intfPrintor";
import { capitalizeFirstLetter, isPrimitive, propertyType } from "./amiUtils";
import { AmiModel } from "./amiModel";
import { AmiObj } from "./amiObj";
import { AmiPropr } from "./amiPropr";

/**
 * Print to typescript.
 */
export class Print2TypeScript extends IntfModelPrintor implements intfModelPrintor {
  //region properties
  /**
   * Typescript Interface
   * TODO Should use precompiled Handlebars Templates !
   * @type {string}
   * @private
   */
  private readonly tsTmplSrc = `
{{~JDocDescr 0 description~}}
export interface {{intfName}} {
  {{#properties}}
  {{~JDocDescr 2 description~}}
  {{~Indent 2~}} {{proprName}} {{proprDecl}} {{proprType}};
  {{/properties}}
  }
`;
  /**
   * Compiled Handlebars Template
   */
  private readonly tsTmpl: any;

  //endregion

  /**
   * Constructor prepare handlebars template
   * @param ami
   * @param {{[p: string]: unknown}} config
   */
  constructor(public readonly ami: AmiModel, public readonly config: any) {
    super(ami, config);
    this.fileExt = ".ts";
    this.outputFmt = "typescript";
    // add custom helpers to Handlebars
    Handlebars.registerHelper("JDocDescr", (indent: number, val: string) => Print2TypeScript.JDocDescr(indent, val));
    this.tsTmpl = Handlebars.compile(this.tsTmplSrc, { noEscape: true });
  }

  //region Template Helpers
  /**
   * Convert `value` to a valid TS Interface Name
   * @param {string} value
   * @returns {string}
   */
  private static buildTSIntfName(value: string): string {
    const intfName = value.replaceAll(/[." -]/g, "_");
    return intfName.replaceAll(/___|__/g, "_");
  }

  /**
   * Convert `value` to a valid TS Property Name
   */
  private static buildTSProprName(value: string): string {
    const intfName = value.replaceAll(/[." -]/g, "_");
    return intfName.replaceAll(/___|__/g, "_");
  }

  private static TSType(property: propertyType): string {
    switch (property) {
      case propertyType.otBigInt:
      case propertyType.otFloat:
      case propertyType.otInteger:
        return "number";
      case propertyType.otString:
        return "string";
      case propertyType.otBoolean:
        return "boolean";
      case propertyType.otList:
        return "Array<any>";
    }
    return "any";
  }

  //endregion

  //region Handlebars Scope Builder functions

  private buildTSProprType(propr: AmiPropr, isElem: boolean = false): string {
    if (propr.sampleTypes.size === 1) {
      switch (propr.type) {
        case propertyType.otBigInt:
        case propertyType.otFloat:
        case propertyType.otInteger:
          return "number";
        case propertyType.otString:
          return "string";
        case propertyType.otBoolean:
          return "boolean";
      }
    }

    if (propr.mapAmiObj instanceof AmiObj) {
      return Print2TypeScript.buildTSIntfName(propr.mapAmiObj.name);
    }

    if (propr.listAmiObj instanceof AmiObj) {
      const typeName = Print2TypeScript.buildTSIntfName(propr.listAmiObj.name);
      return isElem ? typeName : `Array<${typeName}>`;
    }

    if (propr.listTypes.size > 0) {
      const typeNames = Array.from(propr.listTypes)
        .map((vt) => Print2TypeScript.TSType(vt))
        .join(" | ");
      return isElem ? typeNames : `Array<${typeNames}>`;
    }

    if (propr.type === propertyType.otList) {
      return isElem ? "any" : "Array<any>";
    }

    this.ami.cliLogger?.error(`Unknown type for property ${propr.name} in object ${propr.owner.name}`);
    return "any";
  }

  private buildProperties(o: AmiObj): unknown[] {
    return o.properties.map((propr) => {
      return {
        ...propr,
        proprName: Print2TypeScript.buildTSProprName(propr.name),
        proprType: this.buildTSProprType(propr),
        elTypeName: this.buildTSProprType(propr, true),
        proprDecl: propr.required ? " :" : "?:",
        isPrimitive: propr.sampleTypes.size === 1 && isPrimitive(propr.type),
        isAmiObj: propr.mapAmiObj instanceof AmiObj,
        isArray: propr.type === propertyType.otList,
        isArrayOfAmiObj: propr.listAmiObj instanceof AmiObj,
        examples: this.ami.addExamples ? propr.examples : "",
      };
    });
  }
  //endregion

  /**
   * Convert Abstract model into scope to be consumed by handlebars
   */
  private assignTemplateScope(o: AmiObj) {
    this.scope = {
      name: o.name,
      intfName: Print2TypeScript.buildTSIntfName(o.name),
      properties: this.buildProperties(o),
      description: o.description,
    };
    this.finalizeScope(o);
  }

  /**
   * printModel return the typescript code declaring ...
   */
  public printModel(): string {
    let ts = "";
    this.ami.childObjs.forEach((o) => {
      this.assignTemplateScope(o);
      ts = ts + this.tsTmpl(this.scope) + "\n";
    });
    return ts;
  }
}
