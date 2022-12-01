import * as Handlebars from "handlebars";
import { IntfModelPrintor, intfModelPrintor } from "./intfPrintor";
import { AmiModel } from "./amiModel";
import { AmiObj } from "./amiObj";

/**
 * Print to Pascal Record.
 */
export class Print2PascalRecord extends IntfModelPrintor implements intfModelPrintor {
  //region properties
  /**
   * Typescript Interface
   * TODO Should use precompiled Handlebars Templates !
   */
  private readonly pascalTmplSrc = `
{{~DelphiDescr 0 "summary" description}}
type 
  {{#properties}}
  {{#if isArray}} 
    {{~Indent 2~}}{{typeName}} = Array of {{elTypeName}};
  {{/if}}  
  {{/properties}}

  {{typeName}}  = record
  protected
  {{#properties}}
  {{~Indent 4~}}f{{Fill name 20}} : {{typeName}};
  {{/properties}}
  
  public
  {{#properties}}
  {{~Indent 4~}} property {{Fill name 12}} : {{Fill typeName 10}} read f{{Fill name 25}} write f{{name}};
  {{/properties}}
  
  end;
`;
  /**
   * Compiled Handlebars Template
   */
  private readonly pascalTmpl: any = false;

  /**
   * prepared "scope" used to fill the Handlebars Template
   */
  //endregion

  constructor(public readonly ami: AmiModel, public readonly config: any) {
    super(ami, config);
    this.fileExt = ".popo.pas";
    this.outputFmt = "pascal";
    // add custom helpers to Handlebars
    Handlebars.registerHelper("DelphiDescr", (indent: number, val1: string, val2: string) => Print2PascalRecord.DelphiDescr(indent, val1, val2));
    Handlebars.registerHelper("Indent", (indent: number) => " ".repeat(indent));
    Handlebars.registerHelper("Fill", (val: string, indent: number) => (indent > val.length ? val + " ".repeat(indent - val.length) : val));
    Handlebars.registerHelper("json", (context) => JSON.stringify(context, null, 2));
    this.pascalTmpl = Handlebars.compile(this.pascalTmplSrc, { noEscape: true });
  }

  /**
   * Convert Abstract model into scope to be consumed by handlebars
   */
  private assignTemplateScope(o: AmiObj) {
    this.scope = {
      name: o.name,
      objName: IntfModelPrintor.buildPascalObjName(o.name),
      typeName: IntfModelPrintor.buildPascalTypeName(o.name),
      properties: this.buildPascalProperties(o),
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
      ts = ts + this.pascalTmpl(this.scope) + "\n";
    });
    return ts;
  }
}
