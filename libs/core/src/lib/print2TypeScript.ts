import * as Handlebars from "handlebars";
import { intfModelPrintor } from "./intfPrintor";
import { propertyType } from "./amiUtils";
import { AmiModel } from "./amiModel";
import { AmiObj } from "./amiObj";
import { AmiPropr } from "./amiPropr";

/**
 * Print to typescript.
 */
export class Print2TypeScript implements intfModelPrintor {
  //region properties
  /**
   * prepared "scope" used to fill the Handlebars Template
   * @type {any}
   * @private
   */
  private scope?: any;
  /**
   * Typescript Interface
   * TODO Should use precompiled Handlebars Templates !
   * @type {string}
   * @private
   */
  private readonly pascalSOTmplSrc = `
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
  private pascalSOTmpl: any = false;
  //endregion

  /**
   * Constructor prepare handlebars template
   * @param ami
   * @param {{[p: string]: unknown}} config
   */
  constructor(public readonly ami: AmiModel, public readonly config: any) {
    // add custom helpers to Handlebars
    Handlebars.registerHelper("JDocDescr", (indent: number, val: string) => Print2TypeScript.JDocDescr(indent, val));
    Handlebars.registerHelper("Indent", (indent: number) => " ".repeat(indent));
    Handlebars.registerHelper("json", (context) => JSON.stringify(context, null, 2));
  }

  //region Template Helpers
  /**
   * Convert `value` to a valid TS Interface Name
   * @param {string} value
   * @returns {string}
   */
  private static convertTSIntfName(value: string): string {
    const intfName = value.replaceAll(/[." -]/g, "_");
    return intfName.replaceAll(/___|__/g, "_");
  }
  /**
   * Convert `value` to a valid TS Property Name
   */
  private static convertTSPropertyName(value: string): string {
    const intfName = value.replaceAll(/[." -]/g, "_");
    return intfName.replaceAll(/___|__/g, "_");
  }

  /**
   * Format Description
   */
  private static JDocDescr(indent: number, val: string): string | null {
    if (!val) return null;
    const lines = val.split("\n");
    const prefix = " ".repeat(indent);
    if (lines.length > 1) {
      let descr = prefix + "/**\n";
      lines.forEach((l) => (descr += l ? prefix + " * " + l + "\n" : prefix + " *\n"));
      descr += prefix + " */\n";
      return descr;
    }
    return prefix + "/* " + val + " */\n";
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

  /**
   * printModel return the typescript code declaring ...
   */
  public printModel(): string {
    if (!this.ami.rootObj) {
      throw new Error("TS Printor:No root interface found");
    }
    if (!this.pascalSOTmpl) {
      this.pascalSOTmpl = Handlebars.compile(this.pascalSOTmplSrc, { noEscape: true });
    }
    this.assignTemplateScope(this.ami.rootObj);
    this.scope.description ??= this.ami.description ?? "";

    let ts = this.pascalSOTmpl(this.scope);
    if (this.ami.childObjs && this.ami.childObjs.length > 0) {
      this.ami.childObjs.forEach((o) => {
        this.assignTemplateScope(o);
        ts = ts + "\n" + this.pascalSOTmpl(this.scope);
      });
    }
    return ts;
  }

  //region Handlebars Scope Builder functions
  /**
   * Convert Abstract model into scope to be consumed by handlebars
   */
  private assignTemplateScope(o: AmiObj) {
    this.scope = {
      name: Print2TypeScript.convertTSIntfName(o.name),
      description: o.description ?? this.config["description"] ?? "",
      properties: this.buildProperties(o),
    };
  }

  private buildProperties(o: AmiObj): unknown[] {
    return o.properties.map((property) => {
      return {
        ...property,
        name: Print2TypeScript.convertTSPropertyName(property.name),
        decl: property.required ? " :" : "?:",
        type: this.buildPropertyType(property),
      };
    });
  }

  private buildPropertyType(property: AmiPropr): string {
    if (property.sampleTypes.size <= 1) {
      switch (property.type) {
        case propertyType.otBigInt:
        case propertyType.otFloat:
        case propertyType.otInteger:
          return "number";
        case propertyType.otString:
          return "string";
        case propertyType.otBoolean:
          return "boolean";
        case propertyType.otList:
        // if (property.listTypes instanceof AmiPropr) {
        //   return "Array<" + this.buildPropertyType(property.itemsType) + ">";
        // }
      }
    }

    if (property.onlyPrimitives()) {
      const names = Array.from(property.sampleTypes).map((vt) => Print2TypeScript.propertyType(vt));
      const uniques = [...new Set(names)];
      return uniques.join(" | ");
    }

    return "any";
  }
  //endregion
}
