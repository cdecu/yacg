import * as Handlebars from "handlebars";
import { IntfModelPrintor, intfModelPrintor } from "./intfPrintor";
import { AmiModel } from "./amiModel";
import { AmiObj } from "./amiObj";
import { AmiPropr } from "./amiPropr";
import { capitalizeFirstLetter, isPrimitive, propertyType } from "./amiUtils";

/**
 * Print to pascal using SuperObject lib.
 */
export class Print2PascalSO extends IntfModelPrintor implements intfModelPrintor {
  //region properties
  /**
   * prepared "scope" used to fill the Handlebars Template
   */
  private scope?: any;

  /**
   * Handlebars Template text
   */
  private readonly IntfTmplSrc = `{{~DelphiDescr 2 "summary" description}}{{~cr}}  
{{~Indent 2}}{{name}}Field = (
    {{#properties}}
    {{fieldName}}{{#if @last}}{{else}},{{/if}}
    {{/properties}}
{{~Indent 4}});
  {{name}}Fields = Set of {{name}}Field;

  {{name}} = Record
  public   
    const RequiredFields : {{name}}Fields = [
      {{#requiredProperties}}
      {{fieldName}}{{#if @last}}{{else}},{{/if}}
      {{/requiredProperties}}
      ];
  private   
    {{#properties}}
    {{~Indent 4~}}f{{proprName}} : {{typeName}};
    {{/properties}}

    {{#properties}}
    procedure Set_{{proprName}}(Const [ref] Value:{{typeName}});
    {{/properties}}

  public   
    AssignedFields : {{name}}Fields;
    
    ///<summary>Is Value a Property Field</summary>
    class function Name2Field(Const Value:String;Out Field:{{name}}Field):Boolean;static;
    ///<summary>Is Propr Required</summary>
    class function ProprRequired(Const Value:String):Boolean;static;
    
    ///<summary>Clear all properties</summary>
    procedure Clear;
    ///<summary>Compare</summary>
    function Compare(Const [ref] aSource:{{name}}):{{name}}Fields;
    ///<summary>Compare Propr Value</summary>
    Class function CompareField(Const Field:{{name}}Field;Const [ref] Obj1,Obj2:{{name}}):Integer;static; 
    
    ///<summary>Assign from JSON Object</summary>
    procedure AssignSO(const aSource: ISuperObject);
    
    ///<summary>Build JSON Object</summary>
    function AsSO(Const AllProps:Boolean=False):ISuperObject;
    
  public   
    {{#properties}}
    {{~DelphiDescr 4 "summary" description}}
    {{~DelphiDescr 4 "examples" examples}}
    /// required : {{required}}
    property {{proprName}} : {{typeName}} read f{{proprName}} write Set_{{proprName}};
    {{/properties}}
    
  end;
`;

  /**
   * Handlebars Template text
   */
  private readonly ImplementationTmplSrc = `  
Const 
  {{#properties}}
  _JSON_{{proprName}}_ = '{{name}}';
  {{/properties}}
  
{______________________________________________________________________________}
{______________________________________________________________________________}
{______________________________________________________________________________}
function ObjAsVariant(Const obj: ISuperObject):variant;
Begin
  case ObjectGetType(obj) of
    stBoolean :Result:=obj.AsBoolean;
    stDouble,
    stCurrency:Result:=obj.AsDouble;
    stInt     :Result:=obj.AsInteger;
    stString  :Result:=obj.AsString;
    else       Result:=null;
    end;
end;
  
{______________________________________________________________________________}
{______________________________________________________________________________}
{{DelphiDescr 0 "summary" description}}
{______________________________________________________________________________}
class function {{name}}.Name2Field(Const Value:String;Out Field:{{name}}Field):Boolean;
Begin
  {{#properties}}
  {{#if (Equal proprName name)}}
  if SameText(_JSON_{{proprName}}_,Value) then Begin
    Field:={{../name}}Field.{{fieldName}};
    Exit(True); 
    end;
  {{else}}
  if SameText(_JSON_{{proprName}}_,Value) or SameText('{{proprName}}',Value) then Begin 
    Field:={{../name}}Field.{{fieldName}};
    Exit(True); 
    end;
  {{/if}}
  {{/properties}}
  Result:=False;
end;

class function {{name}}.ProprRequired(Const Value:String):Boolean;
Var f:{{name}}Field;
Begin
  if Name2Field(Value,f) then Begin
    Exit(f in RequiredFields);
    end;
  Result:=False;
end;

procedure {{name}}.Clear;
Begin
  AssignedFields:=[];
  {{#properties}}
    {{~Indent 2~}}{{~propClear .}};
  {{/properties}}
end;

Class function {{name}}.CompareField(Const Field:{{name}}Field;Const [ref] Obj1,Obj2:{{name}}):Integer; 
Begin 
  Case Field of 
  {{#properties}}
  {{../name}}Field.{{fieldName}}:Begin
    {{propCompare .}};
    end;
  {{/properties}}
  else Begin
    Assert(False);
    result:=0;
  end end; 
end;

function {{name}}.Compare(Const [ref] aSource:{{name}}):{{name}}Fields;
Begin
  Result:=[];
  {{#properties}}
  if (CompareField({{../name}}Field.{{fieldName}},Self,aSource)<>0) then Begin
    Include(Result,{{../name}}Field.{{fieldName}});
    end;
    
  {{/properties}}
end;  

procedure {{name}}.AssignSO(const aSource: ISuperObject);
Begin
  Self.Clear;
  
  {{#properties}}
  {{~DelphiDescr 2 "examples" examples}}
  Begin 
    var obj:ISuperObject;
    obj := aSource.O[_JSON_{{proprName}}_];
    if obj<>nil then Begin
      Include(AssignedFields,{{../name}}Field.{{fieldName}});
      {{propAssign .}};
  end end;
        
  {{/properties}}
end;

///<summary>Build JSON Object</summary>
function {{name}}.AsSO(Const AllProps:Boolean=False):ISuperObject;
Var o:TSuperTableString;
Begin
  Result:=TSuperObject.Create(stObject);
  o:=Result.AsObject;

  {{#properties}}
  {{~DelphiDescr 2 "examples" examples}}
  if (AllProps) or ( {{../name}}Field.{{fieldName}} in AssignedFields) then Begin   
    {{proprAsSO .}};
    end;
    
  {{/properties}}
end;

{{#properties}}
procedure {{../name}}.Set_{{proprName}}(Const [ref] Value:{{typeName}});
Begin
  Include(AssignedFields,{{../name}}Field.{{fieldName}});
  {{#if isPrimitive}}
  Self.f{{proprName}}:=Value;
  {{else}}
  {{#if isMap}}
  Self.f{{proprName}}.Assign(Value);
  {{else}}
  {{#if isArray}}  
  Begin
  Var i:Integer;
  SetLength(Self.f{{proprName}},Length(Value));
  for i:=0 to Pred(Length(Value)) do
    Self.f{{proprName}}[i].AssignSO(obj.AsArray[i]);
  end;      
  {{else}}
  Self.f{{proprName}}:=Value;
  {{/if}}
  {{/if}}
  {{/if}}
end;
{{/properties}}
`;
  //endregion

  constructor(public readonly ami: AmiModel, public readonly config: any) {
    super();
    // add custom helpers to Handlebars
    Handlebars.registerHelper("DelphiDescr", (indent: number, val1: string, val2: string) => Print2PascalSO.DelphiDescr(indent, val1, val2));
    Handlebars.registerHelper("Indent", (indent: number) => " ".repeat(indent));
    Handlebars.registerHelper("propClear", (propr) => this.propClear(propr));
    Handlebars.registerHelper("propCompare", (propr) => this.propCompare(propr));
    Handlebars.registerHelper("propSetter", (propr) => this.propSetter(propr));
    Handlebars.registerHelper("propAssign", (propr) => this.propAssign(propr));
    Handlebars.registerHelper("proprAsSO", (propr) => this.proprAsSO(propr));
    Handlebars.registerHelper("Equal", (v1, v2) => v1 == v2);
    Handlebars.registerHelper("cr", () => "\n");
    Handlebars.registerHelper("json", (context) => JSON.stringify(context, (name, val) => (name === "ami" || name === "owner" ? null : val), 2));
  }

  //region Template Helpers
  /**
   * Convert `value` to a valid TS Interface Name
   */
  private static buildObjName(value: string): string {
    const intfName = value.replaceAll(/[." -]/g, "_").replaceAll(/___|__/g, "_");
    return capitalizeFirstLetter(intfName);
  }
  private static buildClassName(value: string): string {
    return "T" + Print2PascalSO.buildObjName(value);
  }

  /**
   * Convert `value` to a valid TS Property Name
   */
  private static buildProprName(value: string): string {
    return value.replaceAll(/[." -]/g, "_").replaceAll(/___|__/g, "_");
  }

  private static type2SOFct(type: propertyType): string {
    switch (type) {
      case propertyType.otBigInt:
      case propertyType.otInteger:
        return "AsInteger";
      case propertyType.otFloat:
        return "AsDouble";
      case propertyType.otBoolean:
        return "AsBoolean";
      case propertyType.otString:
        return "AsString";
      default:
        return "AsString";
    }
  }

  private static type2SOPropr(type: propertyType): string {
    switch (type) {
      case propertyType.otBigInt:
      case propertyType.otInteger:
        return "I";
      case propertyType.otFloat:
        return "D";
      case propertyType.otBoolean:
        return "B";
      case propertyType.otString:
        return "S";
      default:
        return "O";
    }
  }

  private static buildPropertyType(propr: AmiPropr): string {
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
      return Print2PascalSO.buildClassName(propr.mapType.name);
    }

    if (propr.listTypes.size === 1) {
      const [i] = propr.listTypes;
      return "Array of " + Print2PascalSO.buildClassName(i.name);
    }
    if (propr.listTypes.size > 1) {
      return "Array of variant";
    }

    return "variant";
  }
  //endregion

  /**
   * printModel return the typescript code declaring ...
   */
  public printModel(): string {
    if (!this.ami.rootObj) {
      throw new Error("No root interface found");
    }
    if (!this.ami.childObjs || this.ami.childObjs.length == 0) {
      throw new Error("Empty Source");
    }

    let ts = "Unit " + this.ami.name + ";\n\n";
    ts += "Uses System.Classes, System.SysUtils, System.Variants, SuperObject;\n\n";
    ts += "Interface\n\n";

    ts += "Type\n";
    let tsIntfTmpl = Handlebars.compile(this.IntfTmplSrc, { noEscape: true });
    this.ami.childObjs.reverse().forEach((o) => {
      this.assignTemplateScope(o);
      ts += tsIntfTmpl(this.scope);
      ts += "\n";
    });

    ts += "Implementation\n\n";

    tsIntfTmpl = Handlebars.compile(this.ImplementationTmplSrc, { noEscape: true });
    this.ami.childObjs.reverse().forEach((o) => {
      this.assignTemplateScope(o);
      ts += tsIntfTmpl(this.scope);
      ts += "\n";
    });

    ts += "end.\n";

    return ts;
  }

  //region Handlebars Scope Builder functions
  /**
   * Convert Abstract model into scope to be consumed by handlebars
   */
  private assignTemplateScope(o: AmiObj) {
    this.scope = {
      ami: this.ami,
      name: Print2PascalSO.buildClassName(o.name),
      objName: Print2PascalSO.buildObjName(o.name),
      properties: this.buildProperties(o),
      description: o.description,
    };
    this.scope.requiredProperties = this.scope.properties.filter((p: any) => p.required);
    if (!this.scope.description) {
      this.scope.description ??= this.ami.name == o.name ? this.ami.description ?? this.config["description"] ?? "" : "";
    }
  }

  /**
   * Build the properties default value.
   */
  private propClear(propr: any): string {
    if (propr.sampleTypes.size === 1) {
      switch (propr.type) {
        case propertyType.otBigInt:
        case propertyType.otFloat:
        case propertyType.otInteger:
          return "f" + propr.proprName + " := 0";
        case propertyType.otString:
          return "f" + propr.proprName + " := ''";
        case propertyType.otBoolean:
          return "f" + propr.proprName + " := False";
      }
    }

    if (propr.mapType instanceof AmiObj) {
      return "f" + propr.proprName + ".Clear";
    }

    if (propr.listTypes.size > 0) {
      return "SetLength(" + "f" + propr.proprName + ", 0)";
    }

    return "f" + propr.proprName + " := NULL";
  }

  /**
   * Build the properties compare Self and aSource
   */
  private propCompare(propr: any): string {
    if (propr.sampleTypes.size === 1) {
      switch (propr.type) {
        case propertyType.otBigInt:
        case propertyType.otFloat:
        case propertyType.otInteger:
          return `Result := CompareValue(obj1.${propr.proprName},obj2.${propr.proprName})`;
        case propertyType.otBoolean:
          return `Result := Ord(obj1.${propr.proprName}) - Ord(obj2.${propr.proprName})`;
        case propertyType.otString:
          return `Result := CompareStr(obj1.${propr.proprName},obj2.${propr.proprName})`;
      }
    }

    if (propr.mapType instanceof AmiObj) {
      return `Result := obj1.${propr.proprName}.Compare(obj2.${propr.proprName})`;
    }

    if (propr.listTypes.size > 0) {
      return `x := CompareValue(obj1.${propr.proprName},obj2.${propr.proprName})`;
    }

    return `Result := CompareValue(obj1.${propr.proprName},obj2.${propr.proprName})`;
  }
  /**
   * Build the properties compare Self and aSource
   */
  private propSetter(propr: any): string {
    return "xxxxxx";
  }

  /**
   * Build the properties assignment from a Source SObject
   */
  private propAssign(propr: any): string {
    if (propr.sampleTypes.size === 1 && isPrimitive(propr.type)) {
      return `self.f${propr.proprName} := obj.${Print2PascalSO.type2SOFct(propr.type)};`;
    }

    if (propr.mapType instanceof AmiObj) {
      return `self.f${propr.proprName}.AssignSO(obj);`;
    }

    if (propr.listTypes.size > 0) {
      return `var i:Integer;
      if (ObjectIsType(obj,stArray)) then Begin 
        SetLength(Self.f${propr.proprName},obj.AsArray.Length);
        for i:=0 to Pred(obj.AsArray.Length) do
          Self.f${propr.proprName}[i].AssignSO(obj.AsArray[i]);
        end`;
    }

    return "self.f" + propr.proprName + " := ObjAsVariant(obj);";
  }

  private proprAsSO(propr: any): string {
    if (propr.sampleTypes.size === 1 && isPrimitive(propr.type)) {
      return "o." + Print2PascalSO.type2SOPropr(propr.type) + "[_JSON_" + propr.proprName + "_] := Self." + propr.proprName;
    }

    if (propr.mapType instanceof AmiObj) {
      return "o.O[_JSON_" + propr.proprName + "_] := Self." + propr.proprName + ".AsSO(AllProps)";
    }

    if (propr.listTypes.size > 0) {
      return `Begin 
    var p:ISuperObject;
    var i,len:Integer;
    len:=Length(Self.${propr.proprName});
    p:=TSuperObject.Create(stArray);
    for i:=0 to Pred(len) do
      p.AsArray.Add(Self.${propr.proprName}[i].AsSO(AllProps));
    o.O[_JSON_" + ${propr.proprName} + "_] := p;`;
    }

    return "o.O[_JSON_" + propr.proprName + "_] := SuperObject.SObj(Self." + propr.proprName + ")";
  }

  private buildProperties(o: AmiObj): unknown[] {
    return o.properties.map((property) => {
      if (!this.ami.addExamples) property.examples = "";
      return {
        ...property,
        proprName: Print2PascalSO.buildProprName(property.name),
        typeName: Print2PascalSO.buildPropertyType(property),
        fieldName: Print2PascalSO.buildObjName(o.name) + "_" + Print2PascalSO.buildProprName(property.name),
        isPrimitive: property.sampleTypes.size === 1 && isPrimitive(property.type),
        isMap: property.mapType instanceof AmiObj,
        isArray: property.listTypes.size > 0,
        isMultiArray: property.listTypes.size > 1,
      };
    });
  }
  //endregion
}
