import * as Handlebars from "handlebars";
import { IntfModelPrintor, intfModelPrintor } from "./intfPrintor";
import { propertyType } from "./amiUtils";
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
export interface {{name}} {
  {{#properties}}
  {{~JDocDescr 2 description~}}
  {{~Indent 2~}} {{name}} {{decl}} {{type}};
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
    Handlebars.registerHelper("Indent", (indent: number) => " ".repeat(indent));
    Handlebars.registerHelper("Fill", (val: string, indent: number) => (indent > val.length ? val + " ".repeat(indent - val.length) : val));
    Handlebars.registerHelper("json", (context) => JSON.stringify(context, null, 2));
    this.tsTmpl = Handlebars.compile(this.tsTmplSrc, { noEscape: true });
  }

  //region Template Helpers
  /**
   * Convert `value` to a valid TS Interface Name
   * @param {string} value
   * @returns {string}
   */
  private static buildIntfName(value: string): string {
    const intfName = value.replaceAll(/[." -]/g, "_");
    return intfName.replaceAll(/___|__/g, "_");
  }

  /**
   * Convert `value` to a valid TS Property Name
   */
  private static buildPropertyName(value: string): string {
    const intfName = value.replaceAll(/[." -]/g, "_");
    return intfName.replaceAll(/___|__/g, "_");
  }

  private static propertyType(property: propertyType): string {
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
  private buildProperties(o: AmiObj): unknown[] {
    return o.properties.map((propr) => {
      return {
        ...propr,
        proprName: Print2TypeScript.buildPropertyName(propr.name),
        decl: propr.required ? " :" : "?:",
        type: this.buildPropertyType(propr),
        examples: this.ami.addExamples ? propr.examples : "",
      };
    });
  }

  private buildPropertyType(propr: AmiPropr): string {
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
      return Print2TypeScript.buildIntfName(propr.mapAmiObj.name);
    }

    if (propr.listAmiObj instanceof AmiObj) {
      return Print2TypeScript.buildIntfName(propr.listAmiObj.name) + "Array";
    }

    if (propr.onlyPrimitives()) {
      const names = Array.from(propr.sampleTypes).map((vt) => Print2TypeScript.propertyType(vt));
      const uniques = [...new Set(names)];
      return uniques.join(" | ");
    }

    this.ami.cliLogger?.error(`Unknown type for property ${propr.name} in object ${propr.owner.name}`);
    return "any";
  }

  //endregion

  /**
   * Convert Abstract model into scope to be consumed by handlebars
   */
  private assignTemplateScope(o: AmiObj) {
    this.scope = {
      name: Print2TypeScript.buildIntfName(o.name),
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
    this.ami.childObjs.reverse().forEach((o) => {
      this.assignTemplateScope(o);
      ts = ts + this.tsTmpl(this.scope) + "\n";
    });
    return ts;
  }
}
