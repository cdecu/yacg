import * as Handlebars from 'handlebars';
import { IntfModelPrintor, intfModelPrintor } from "./intfPrintor";
import { AmiModel } from "./amiModel";
import { AmiObj } from "./amiObj";
import { AmiPropr } from "./amiPropr";
import { propertyType } from "./amiUtils";

/**
 * Print to Pascal Record.
 */
export class Print2PascalRecord extends IntfModelPrintor implements intfModelPrintor {
  //region properties
  /**
   * prepared "scope" used to fill the Handlebars Template
   */
  private scope?: any;

  /**
   * Typescript Interface
   * TODO Should use precompiled Handlebars Templates !
   */
  private readonly pascalTmplSrc = `
{{~JDocDescr 0 description~}}
type {{name}}  = record
  {{#properties}}
  {{~JDocDescr 2 description~}}
  {{~Indent 2~}} {{name}} {{decl}} {{type}};
  {{/properties}}
  end;
`;
  /**
   * Compiled Handlebars Template
   */
  private pascalTmpl: any = false;
  /**
   * prepared "scope" used to fill the Handlebars Template
   */
  //endregion

  constructor(public readonly ami: AmiModel, public readonly config: any) {
    super();
    // add custom helpers to Handlebars
    Handlebars.registerHelper("JDocDescr", (indent: number, val: string) => Print2PascalRecord.JDocDescr(indent, val));
    Handlebars.registerHelper("Indent", (indent: number) => " ".repeat(indent));
    Handlebars.registerHelper("json", (context) => JSON.stringify(context, null, 2));
  }

  //region Template Helpers
  /**
   * Convert `value` to a valid TS Interface Name
   */
  private static convertIntfName(value: string): string {
    const intfName = value.replaceAll(/[." -]/g, "_");
    return intfName.replaceAll(/___|__/g, "_");
  }

  /**
   * Convert `value` to a valid TS Property Name
   */
  private static convertPropertyName(value: string): string {
    const intfName = value.replaceAll(/[." -]/g, "_");
    return intfName.replaceAll(/___|__/g, "_");
  }
  //endregion

  /**
   * printModel return the typescript code declaring ...
   */
  public printModel(): string {
    if (!this.ami.rootObj) {
      throw new Error("No root interface found");
    }
    if (!this.pascalTmpl) {
      this.pascalTmpl = Handlebars.compile(this.pascalTmplSrc, { noEscape: true });
    }

    this.assignTemplateScope(this.ami.rootObj);
    this.scope.description ??= this.ami.description ?? "";

    let ts = this.pascalTmpl(this.scope);
    if (this.ami.childObjs && this.ami.childObjs.length > 0) {
      this.ami.childObjs.forEach((o) => {
        this.assignTemplateScope(o);
        ts = ts + "\n" + this.pascalTmpl(this.scope);
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
      name: Print2PascalRecord.convertIntfName(o.name),
      description: o.description ?? this.config["description"] ?? "",
      properties: this.buildProperties(o),
    };
  }

  private buildProperties(o: AmiObj): unknown[] {
    return o.properties.map((property) => {
      return {
        ...property,
        name: Print2PascalRecord.convertPropertyName(property.name),
        decl: ":",
        type: this.buildPropertyType(property),
      };
    });
  }

  private buildPropertyType(property: AmiPropr): string {
    if (property.sampleTypes.size <= 1) {
      switch (property.type) {
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
        case propertyType.otList:
        // if (property.listTypes instanceof AmiPropr) {
        //   return "Array of " + this.buildPropertyType(property.itemsType);
        // }
      }
    }
    return "variant" + " " + property.type + " / " + property.mapType + " / " + property.listTypes;
  }

  //endregion
}
