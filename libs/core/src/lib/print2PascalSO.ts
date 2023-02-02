import * as Handlebars from "handlebars";
import { IntfModelPrintor, intfModelPrintor } from "./intfPrintor";
import { AmiModel } from "./amiModel";
import { AmiObj } from "./amiObj";
import { isPrimitive, propertyType } from "./amiUtils";
import { ConfigIntf } from "./amiConfig";

/**
 * Print to pascal using SuperObject lib.
 */
export class Print2PascalSO extends IntfModelPrintor implements intfModelPrintor {
  //region properties
  /**
   * Handlebars Template text
   */
  private readonly IntfTmplSrc = `{{~DelphiDescr 2 "summary" description}}{{~cr}}  
{{~Indent 2}}{{typeName}}Field = (
    {{#properties}}
    {{fieldName}}{{#if @last}}{{else}},{{/if}}
    {{/properties}}
{{~Indent 4}});
  {{typeName}}Fields = Set of {{typeName}}Field;

{{#properties}}
  {{#if isArray}} 
    {{~Indent 2~}}{{typeName}} = Array of {{elTypeName}};
  {{/if}}  
{{/properties}}

  {{typeName}}Ptr = ^{{typeName}};
  {{typeName}} = Record
  public   
    const RequiredFields : {{typeName}}Fields = [
      {{#requiredProperties}}
      {{fieldName}}{{#if @last}}{{else}},{{/if}}
      {{/requiredProperties}}
      ];
  private   
    {{#properties}}
    {{~Indent 4~}}f{{Fill proprName 20}}: {{typeName}};
    {{/properties}}
    /// <summary>Runtime properties</summary>
    fTag                  : NativeInt;
    fTagKey               : String;
    fTagObj               : TObject;
    fTagGUID              : TGUID;
    
    {{#properties}}
    {{#if needGetter}}
    function Get_{{proprName}}:{{typeName}};
    {{/if}}    
    procedure Set_{{proprName}}(Const {{#if asConstRef}}[ref] {{/if}} Value:{{typeName}});
    {{/properties}}

  public   
    AssignedFields : {{typeName}}Fields;
    
    ///<summary>Is Value a Property Field</summary>
    class function Name2Field(Const Value:String;Out Field:{{typeName}}Field):Boolean;static;
    ///<summary>Is Propr Required</summary>
    class function ProprRequired(Const Value:String):Boolean;static;
    
    ///<summary>Clear all properties</summary>
    procedure Clear;
    ///<summary>Compare</summary>
    function Compare(Const [ref] aSource:{{typeName}}):{{typeName}}Fields;overload;
    ///<summary>Compare</summary>
    Class function Compare(Const [ref] Obj1,Obj2:{{typeName}}):{{typeName}}Fields;overload;static;
    ///<summary>Compare Propr Value</summary>
    Class function CompareField(Const Field:{{typeName}}Field;Const [ref] Obj1,Obj2:{{typeName}}):Integer;static; 
    
    ///<summary>Assign from Object</summary>
    function Assign(const [ref] aSource: {{typeName}};Const OnlyFields:{{typeName}}Fields):{{typeName}}Fields;
    
    ///<summary>Assign from JSON Object</summary>
    function AssignSO(const aSource: ISuperObject):{{typeName}}Fields;
    
    ///<summary>Build JSON Object</summary>
    function AsSO(Const AllProps:Boolean=False):ISuperObject;
    
  public   
    {{#properties}}
    {{~DelphiDescr 4 "summary" description}}
    {{~DelphiDescr 4 "examples" examples}}
    /// required : {{required}}
    {{#if needGetter}}
    property {{proprName}} : {{typeName}} read Get_{{proprName}} write Set_{{proprName}};
    {{else}}    
    property {{proprName}} : {{typeName}} read f{{proprName}} write Set_{{proprName}};
    {{/if}}    
    {{/properties}}

    /// <summary>Runtime properties</summary>
    property Tag     : NativeInt read fTag     write fTag;
    /// <summary>Runtime properties</summary>
    property TagKey  : String    read fTagKey  write fTagKey;
    /// <summary>Runtime properties</summary>
    property TagObj  : TObject   read fTagObj  write fTagObj;
    /// <summary>Runtime properties</summary>
    property TagGUID : TGUID     read fTagGUID write fTagGUID;
    
  end;

  {{#if isRoot}}
  {{typeName}}s = Class
  private
    f{{objName}}s : Array of {{typeName}};

    /// <summary>Get Count</summary>
    function GetCount:Integer;
    /// <summary>Getter</summary>
    function GetItem(Const Idx:Integer):{{typeName}}Ptr;
  
  public 
    /// <summary>Destructor</summary>
    Destructor Destroy;override;
    /// <summary>Destructor</summary>
    procedure Clear;
    /// <summary>Reset Tags</summary>
    procedure RAZTags;
    /// <summary>Download Item</summary>
    procedure Assign(Const so:ISuperObject);
    /// <summary>Download Item</summary>
    procedure Update(Const so:ISuperObject);

    /// <summary>Add one Item</summary>
    function Add:{{typeName}}Ptr;
    /// <summary>Find Item</summary>
    function FindById(Const aId:Integer;Var Ptr:{{typeName}}Ptr):Boolean;
    /// <summary>Find Item</summary>
    function FindByUID(Const aUID:String;Var Ptr:{{typeName}}Ptr):Boolean;overload;
    /// <summary>Find Item</summary>
    function FindByUID(Const guid:TGUID;Var Ptr:{{typeName}}Ptr):Boolean;overload;
    /// <summary>Find Item</summary>
    function FindBy(Const [ref] Obj1:{{typeName}};Const Field:{{typeName}}Field;Var Ptr:{{typeName}}Ptr):Integer;overload;

    ///<summary>Build JSON Object</summary>
    function AsSO(Const AllProps:Boolean=False):ISuperObject;

    /// <summary>Array Length</summary>
    property Count : Integer     read GetCount;
    property Items[Const Idx:Integer] : {{typeName}}Ptr read GetItem;default;
  end;
  {{/if}}
  
`;

  /**
   * Handlebars Template text
   */
  private readonly ImplConstDefTmplSrc = `  
Const 
  {{#properties}}
  _JSON_{{proprName}}_ = '{{name}}';
  {{/properties}}
`;

  /**
   * Handlebars Template text
   */
  private readonly ImplUtilsTmplSrc = `  
{{#if isRoot}}
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
function CompareVariant(Const val1,val2: variant):Integer;
Var vt1,vt2: TVarType;
Begin
  vt1:=FindVarData(val1)^.VType;
  vt2:=FindVarData(val2)^.VType;
  if (vt1 in [varNull,varEmpty]) then Begin
    Case vt2 of
      varNull,varEmpty:Begin
        // Null equal Null
        Result:=0
        end;
      varString,varUString:Begin
        // Empty String equal null 
        if (val2='') then
          Result:= 0 else
          Result:=-1
        End;
      else Begin
        Result:=-1
      end end;
  End else
  if (vt1=vt2) then Begin
    case vt1 of
    varByte,
    varWord,
    varLongWord,
    varSmallint,
    varShortInt,
    varInteger,
    varInt64:Begin
      Var i1,i2:Int64;
      i1:=Val1;
      i2:=Val2;
      Result:=CompareValue(i1,i2);
      End;
    varSingle,
    varDouble,
    varCurrency:Begin
      Var e1,e2:Extended;
      e1:=Val1;
      e2:=Val2;
      Result:=CompareValue(e1,e2);
      End;
    else Result:=CompareStr(val1,val2);
    end;
  End else
    Result:=CompareStr(val1,val2);
end;

{{/if}}    
`;

  /**
   * Handlebars Template text
   */
  private readonly ImplTmplSrc = `  
{______________________________________________________________________________}
{______________________________________________________________________________}
{{DelphiDescr 0 "summary" description}}
{______________________________________________________________________________}
class function {{typeName}}.Name2Field(Const Value:String;Out Field:{{typeName}}Field):Boolean;
Begin
  {{#properties}}
  {{#if (Equal proprName name)}}
  if SameText(_JSON_{{proprName}}_,Value) then Begin
    Field:={{../typeName}}Field.{{fieldName}};
    Exit(True); 
    end;
  {{else}}
  if SameText(_JSON_{{proprName}}_,Value) or SameText('{{proprName}}',Value) then Begin 
    Field:={{../typeName}}Field.{{fieldName}};
    Exit(True); 
    end;
  {{/if}}
  {{/properties}}
  Result:=False;
end;

class function {{typeName}}.ProprRequired(Const Value:String):Boolean;
Var f:{{typeName}}Field;
Begin
  if Name2Field(Value,f) then Begin
    Exit(f in RequiredFields);
    end;
  Result:=False;
end;

procedure {{typeName}}.Clear;
Begin
  AssignedFields:=[];
  {{#properties}}
    {{~Indent 2~}}{{~propClear . 20}};
  {{/properties}}
end;

Class function {{typeName}}.CompareField(Const Field:{{typeName}}Field;Const [ref] Obj1,Obj2:{{typeName}}):Integer; 
Begin 
  Case Field of 
  {{#properties}}
  {{../typeName}}Field.{{fieldName}}:Begin
    {{propCompare .}};
    end;
  {{/properties}}
  else Begin
    Assert(False);
    result:=0;
  end end; 
end;

function {{typeName}}.Compare(Const [ref] aSource:{{typeName}}):{{typeName}}Fields;
Begin
  Result:=[];
  {{#properties}}
  if (CompareField({{../typeName}}Field.{{fieldName}},Self,aSource)<>0) then Begin
    Include(Result,{{../typeName}}Field.{{fieldName}});
    end;
    
  {{/properties}}
end;  
Class function {{typeName}}.Compare(Const [ref] Obj1,Obj2:{{typeName}}):{{typeName}}Fields;
Begin
  Result:=[];
  {{#properties}}
  if (CompareField({{../typeName}}Field.{{fieldName}},Obj1,Obj2)<>0) then Begin
    Include(Result,{{../typeName}}Field.{{fieldName}});
    end;
    
  {{/properties}}
end;  

function {{typeName}}.Assign(const [ref] aSource: {{typeName}};Const OnlyFields:{{typeName}}Fields):{{typeName}}Fields;
Begin
  Result:=[];
  {{#properties}}
  if ({{../typeName}}Field.{{fieldName}} in OnlyFields) or (OnlyFields=[]) then Begin 
    if (CompareField({{../typeName}}Field.{{fieldName}},Self,aSource)<>0) then 
      Include(Result,{{../typeName}}Field.{{fieldName}});
    if {{../typeName}}Field.{{fieldName}} in aSource.AssignedFields then 
      Include(AssignedFields,{{../typeName}}Field.{{fieldName}}) else 
      Exclude(AssignedFields,{{../typeName}}Field.{{fieldName}});
    {{#if isPrimitive}}
    Self.f{{proprName}}:=aSource.f{{proprName}};
    {{else}}
    {{#if isAmiObj}}
    Self.f{{proprName}}.Assign(Value);
    {{else}}
    {{#if isArray}}  
    Begin
    Var i,len:Integer;
    len:=Length(aSource.f{{proprName}});
    SetLength(Self.f{{proprName}},len);
    if (len>0) then Begin
      for i:=0 to Pred(len) do
        {{#if isArrayOfAmiObj}}  
        Self.f{{proprName}}[i].Assign(aSource.f{{proprName}}[i],[]);
        {{else}}
        Self.f{{proprName}}[i]  := aSource.f{{proprName}}[i];
        {{/if}}
    end end;      
    {{else}}
    Self.f{{proprName}}:=aSource.f{{proprName}};
    {{/if}}
    {{/if}}
    {{/if}}
    end;
  
  {{/properties}}
end;

function {{typeName}}.AssignSO(const aSource: ISuperObject):{{typeName}}Fields;
Begin
  Result:=[];
  Self.Clear; 
  {{#properties}}
  Begin 
    var obj:ISuperObject;
    obj := aSource.O[_JSON_{{proprName}}_];
    if (obj<>nil) then Begin
      Include(Result,{{../typeName}}Field.{{fieldName}});
      if (obj<>nil) and (not ObjectIsNull(obj)) then Begin
        Include(AssignedFields,{{../typeName}}Field.{{fieldName}});
        {{propAssign .}};
  end end end;
        
  {{/properties}}
end;

///<summary>Build JSON Object</summary>
function {{typeName}}.AsSO(Const AllProps:Boolean=False):ISuperObject;
Var o:TSuperTableString;
Begin
  Result:=TSuperObject.Create(stObject);
  o:=Result.AsObject;

  {{#properties}}
  if (AllProps) or ( {{../typeName}}Field.{{fieldName}} in AssignedFields) then Begin   
    {{proprAsSO .}};
    end;
    
  {{/properties}}
end;

{{#properties}}
procedure {{../typeName}}.Set_{{proprName}}(Const {{#if asConstRef}}[ref] {{/if}} Value:{{typeName}});
Begin
  {{#if isPrimitive}}
  Include(AssignedFields,{{../typeName}}Field.{{fieldName}});
  Self.f{{proprName}}:=Value;
  {{else}}
  {{#if isAmiObj}}
  Include(AssignedFields,{{../typeName}}Field.{{fieldName}});
  Self.f{{proprName}}.Assign(Value);
  {{else}}
  {{#if isArray}}  
  Begin
  Var i,len:Integer;
  len:=Length(Value);
  SetLength(Self.f{{proprName}},len);
  if (len>0) then Begin
    Include(AssignedFields,{{../typeName}}Field.{{fieldName}});
    for i:=0 to Pred(len) do
      {{#if isArrayOfAmiObj}}  
      Self.f{{proprName}}[i].Assign(Value[i],[]);
      {{else}}
      Self.f{{proprName}} := Value[i];
      {{/if}}
    end end;      
  {{else}}
  Include(AssignedFields,{{../typeName}}Field.{{fieldName}});
  Self.f{{proprName}}:=Value;
  {{/if}}
  {{/if}}
  {{/if}}
end;
{{/properties}}

{{#if isRoot}}
{______________________________________________________________________________}
{______________________________________________________________________________}
{______________________________________________________________________________}
destructor {{typeName}}s.Destroy;
begin
  Self.Clear;
  inherited;
end;
procedure {{typeName}}s.Clear;
begin
  SetLength(f{{objName}}s,0);
end;
function {{typeName}}s.GetCount:Integer;
Begin
  Result:=Length(f{{objName}}s);  
end;
function {{typeName}}s.GetItem(Const Idx:Integer):{{typeName}}Ptr;
Var len:Integer;
Begin
  len:=Length(f{{objName}}s);
  if (Idx>=0) and (Idx<len) then Begin  
    Result:=@f{{objName}}s[Idx];
  end else 
    Result:=nil;
end;    
procedure {{typeName}}s.RAZTags;
var Ptr: {{typeName}}Ptr;
    i,len:Integer;
begin
  len:=Length(f{{objName}}s);
  for i:=0 to Pred(len) do Begin
    Ptr:=@f{{objName}}s[i];
    Ptr.fTag   := 0;
    Ptr.fTagKey:='';
    Ptr.fTagObj:= nil;
    RAZGuid(Ptr.fTagGuid);
    {{#properties}}
    {{#if isAmiObj}}
    Ptr.f{{proprName}}.fTag   := 0;
    Ptr.f{{proprName}}.fTagKey:='';
    Ptr.f{{proprName}}.fTagObj:= nil;
    RAZGuid(Ptr.f{{proprName}}.fTagGuid);
    {{/if}}    
    {{#if isArrayOfAmiObj}}
    Begin
    Var i1,len1:Integer;
    len1:=Length(Ptr.f{{proprName}});
    for i1:=0 to Pred(len1) do Begin
      Ptr.f{{proprName}}[i1].fTag   := 0;
      Ptr.f{{proprName}}[i1].fTagKey:='';
      Ptr.f{{proprName}}[i1].fTagObj:=nil;
      RAZGuid(Ptr.f{{proprName}}[i1].fTagGuid);
    end end;
    {{/if}}        
    {{/properties}}    
    end;
end;
procedure {{typeName}}s.Assign(const so: ISuperObject);
Var i,len:Integer;
    a:TSuperArray;
Begin
  a:=so.AsArray;
  len:=a.Length;
  SetLength(f{{objName}}s,Len);
  for i:=0 to Pred(len) do Begin
    f{{objName}}s[i].AssignSO( a[i] )
    end;
end;
procedure {{typeName}}s.Update(const so: ISuperObject);
Var SOFields:{{typeName}}Fields;
    found:{{typeName}}Ptr;
    tempo:{{typeName}};
    i,len:Integer;
    a:TSuperArray;
Begin
  a:=so.AsArray;
  len:=a.Length;
  for i:=0 to Pred(len) do Begin
    SOFields:=tempo.AssignSO(a[i]);
    if (Self.FindByUID(tempo.uid,found)) Then Begin
      found.Assign(tempo,SOFields);
    end else Begin
      found:=Self.Add;
      found.Assign(tempo,SOFields);
    end end;
end;
function {{typeName}}s.Add:{{typeName}}Ptr;
Var len:Integer;
begin
  len:=Length(f{{objName}}s);
  SetLength(f{{objName}}s,Len+1);
  Result:=@f{{objName}}s[Len];
  Result.Clear;
end;
function {{typeName}}s.FindById(const aId: Integer;var Ptr: {{typeName}}Ptr): Boolean;
Var i,len:Integer;
begin
  len:=Length(f{{objName}}s);
  for i:=0 to Pred(len) do Begin
    Ptr:=@f{{objName}}s[i];
    if Ptr.fid=aId then Begin
      Exit(True);
    end end;
  Ptr:=nil;
  Result:=False;
end;

function {{typeName}}s.FindByUID(const aUID: String;var Ptr: {{typeName}}Ptr): Boolean;
Var i,len:Integer;
    guid,g:TGUID;
begin
  if Str2GUID(aUID,guid) then Begin
    len:=Length(f{{objName}}s);
    for i:=0 to Pred(len) do Begin
      Ptr:=@f{{objName}}s[i];
      if Str2GUID(Ptr.fuid,g) and (SameGUID(guid,g)) then Begin
        Exit(True);
    end end end;
  Ptr:=nil;
  Result:=False;
end;

function {{typeName}}s.FindByUID(const guid: TGUID;var Ptr: {{typeName}}Ptr): Boolean;
Var i,len:Integer;
    g:TGUID;
begin
  len:=Length(f{{objName}}s);
  for i:=0 to Pred(len) do Begin
    Ptr:=@f{{objName}}s[i];
    if Str2GUID(Ptr.fuid,g) and (SameGUID(guid,g)) then Begin
      Exit(True);
    end end;
  Ptr:=nil;
  Result:=False;
end;

function {{typeName}}s.FindBy(Const [ref] Obj1:{{typeName}};Const Field:{{typeName}}Field;Var Ptr:{{typeName}}Ptr):Integer;
Var i,len:Integer;
begin
  Ptr:=nil;
  Result:=0;
  len:=Length(f{{objName}}s);
  for i:=0 to Pred(len) do Begin
    if Obj1.CompareField(Field,Obj1,f{{objName}}s[i])=0 then Begin
      Ptr:=@f{{objName}}s[i];
      Inc(Result);
    end end;
end;

function {{typeName}}s.AsSO(Const AllProps:Boolean=False):ISuperObject;
Var i,len:Integer;
    a:TSuperArray;
begin
  Result:=TSuperObject.Create(stArray);

  a:=Result.AsArray;
  len:=Length(f{{objName}}s);
  for i:=0 to Pred(len) do Begin
    a.Add(f{{objName}}s[i].AsSO(AllProps));
    end
End;

{{/if}}

`;
  //endregion

  constructor(public readonly ami: AmiModel, public readonly config: ConfigIntf) {
    super(ami, config);
    this.fileExt = ".pas";
    this.outputFmt = "pascal-so";
    // add custom helpers to Handlebars
    Handlebars.registerHelper("DelphiDescr", (indent: number, val1: string, val2: string) => Print2PascalSO.DelphiDescr(indent, val1, val2));
    Handlebars.registerHelper("Indent", (indent: number) => " ".repeat(indent));
    Handlebars.registerHelper("Fill", (val: string, fill: number) => (fill > val.length ? val + " ".repeat(fill - val.length) : val));
    Handlebars.registerHelper("propClear", (propr, fill) => this.propClear(propr, fill));
    Handlebars.registerHelper("propCompare", (propr) => this.propCompare(propr));
    Handlebars.registerHelper("propAssign", (propr) => this.propAssign(propr));
    Handlebars.registerHelper("proprAsSO", (propr) => this.proprAsSO(propr));
    Handlebars.registerHelper("Equal", (v1, v2) => v1 == v2);
    Handlebars.registerHelper("cr", () => "\n");
    Handlebars.registerHelper("json", (context) => JSON.stringify(context, (name, val) => (name === "ami" || name === "owner" ? null : val), 2));
  }

  //region Template Helpers

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
  //endregion

  //region Handlebars Scope Builder functions
  /**
   * Build the properties default value.
   */
  private propClear(propr: any, fill: number = 25): string {
    const filler = fill > propr.proprName.length ? " ".repeat(fill - propr.proprName.length) : " ";

    if (propr.sampleTypes.size === 1) {
      switch (propr.type) {
        case propertyType.otBigInt:
        case propertyType.otFloat:
        case propertyType.otInteger:
          return "f" + propr.proprName + filler + ":= 0";
        case propertyType.otString:
          return "f" + propr.proprName + filler + ":= ''";
        case propertyType.otBoolean:
          return "f" + propr.proprName + filler + ":= False";
      }
    }

    if (propr.isAmiObj) {
      return "f" + propr.proprName + ".Clear";
    }

    if (propr.isArray) {
      return "SetLength(" + "f" + propr.proprName + ", 0)";
    }

    return "f" + propr.proprName + filler + ":= NULL";
  }

  /**
   * Build the properties compare Self and aSource
   */
  private propCompare(propr: any): string {
    if (propr.sampleTypes.size === 1) {
      const CompareFct = IntfModelPrintor.PascalCompareFct(propr.type);
      switch (propr.type) {
        case propertyType.otBoolean:
          return `Result := ${CompareFct}(Ord(obj1.f${propr.proprName}),Ord(obj2.f${propr.proprName}))`;
        case propertyType.otBigInt:
        case propertyType.otFloat:
        case propertyType.otInteger:
        case propertyType.otString:
          return `Result := ${CompareFct}(obj1.f${propr.proprName},obj2.f${propr.proprName})`;
      }
    }

    if (propr.isAmiObj) {
      return `Result := obj1.f${propr.proprName}.Compare(obj2.f${propr.proprName})`;
    }

    if (propr.isArrayOfAmiObj) {
      return `Var Len1,Len2:Integer;
    Len1:=Length(obj1.f${propr.proprName});
    Len2:=Length(obj2.f${propr.proprName});
    Result:= CompareValue(Len1,Len2);
    if Result=0 then Begin
      Var i:Integer;
      for i:=0 to Pred(Len1) do Begin
        if ${propr.elTypeName}.Compare(obj1.f${propr.proprName}[i],obj2.f${propr.proprName}[i])<>[] then Begin
          Result:=-1;
          Break;
      end end end`;
    }

    if (propr.listTypes.size === 1) {
      const [type] = propr.listTypes;
      const CompareFct = IntfModelPrintor.PascalCompareFct(type);
      return `Var Len1,Len2:Integer;
    Len1:=Length(obj1.f${propr.proprName});
    Len2:=Length(obj2.f${propr.proprName});
    Result:= CompareValue(Len1,Len2);
    if Result=0 then Begin
      Var i:Integer;
      for i:=0 to Pred(Len1) do Begin
        Result:=${CompareFct}(obj1.f${propr.proprName}[i],obj2.f${propr.proprName}[i]);
        if Result<>0 then 
          Break;
      end end`;
    }

    if (propr.type === propertyType.otList) {
      return `Var Len1,Len2:Integer;
    Len1:=Length(obj1.f${propr.proprName});
    Len2:=Length(obj2.f${propr.proprName});
    Result:= CompareValue(Len1,Len2);
    if Result=0 then Begin
      Var i:Integer;
      for i:=0 to Pred(Len1) do Begin
        Result:=CompareVariant(obj1.f${propr.proprName}[i],obj2.f${propr.proprName}[i]);
        if Result<>0 then 
          Break;
      end end`;
    }

    return `Result := CompareVariant(obj1.f${propr.proprName},obj2.f${propr.proprName})`;
  }

  /**
   * Build the properties assignment from a Source SObject
   */
  private propAssign(propr: any): string {
    if (propr.sampleTypes.size === 1) {
      switch (propr.type) {
        case propertyType.otString:
        case propertyType.otBoolean:
        case propertyType.otInteger:
        case propertyType.otBigInt:
        case propertyType.otFloat:
          return `self.f${propr.proprName} := obj.${Print2PascalSO.type2SOFct(propr.type)}`;
      }
    }

    if (propr.isAmiObj) {
      return `self.f${propr.proprName}.AssignSO(obj)`;
    }

    if (propr.isArrayOfAmiObj) {
      return `if (ObjectIsType(obj,stArray)) then Begin
          var i:Integer; 
          SetLength(Self.f${propr.proprName},obj.AsArray.Length);
          for i:=0 to Pred(obj.AsArray.Length) do
            Self.f${propr.proprName}[i].AssignSO(obj.AsArray[i]);
          end`;
    }

    if (propr.isArray) {
      return `if (ObjectIsType(obj,stArray)) then Begin
          var i:Integer; 
          SetLength(Self.f${propr.proprName},obj.AsArray.Length);
          for i:=0 to Pred(obj.AsArray.Length) do
            Self.f${propr.proprName}[i] := obj.AsArray[i];
          end`;
    }

    return "self.f" + propr.proprName + " := ObjAsVariant(obj)";
  }

  private proprAsSO(propr: any): string {
    if (propr.sampleTypes.size === 1) {
      switch (propr.type) {
        case propertyType.otString:
        case propertyType.otBoolean:
        case propertyType.otInteger:
        case propertyType.otBigInt:
        case propertyType.otFloat:
          return "o." + Print2PascalSO.type2SOPropr(propr.type) + "[_JSON_" + propr.proprName + "_] := f" + propr.proprName;
      }
    }

    if (propr.isAmiObj) {
      return "o.O[_JSON_" + propr.proprName + "_] := f" + propr.proprName + ".AsSO(AllProps)";
    }

    if (propr.isArrayOfAmiObj) {
      return `Begin 
    var p:ISuperObject;
    var i,len:Integer;
    len:=Length(f${propr.proprName});
    p:=TSuperObject.Create(stArray);
    for i:=0 to Pred(len) do
      p.AsArray.Add(f${propr.proprName}[i].AsSO(AllProps));
    o.O[_JSON_${propr.proprName}_] := p 
    end`;
    }

    if (propr.isArray) {
      return `Begin 
    var p:ISuperObject;
    var i,len:Integer;
    len:=Length(f${propr.proprName});
    p:=TSuperObject.Create(stArray);
    for i:=0 to Pred(len) do
      p.AsArray.Add(SuperObject.SObj(f${propr.proprName}[i]));
    o.O[_JSON_${propr.proprName}_] := p 
    end`;
    }

    return `o.O[_JSON_${propr.proprName}_] := SuperObject.SObj(Self.${propr.proprName})`;
  }

  //endregion

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
    let ts = "Unit " + this.ami.name + ";\n\n";
    ts += "Interface\n\n";
    ts += "Uses System.Classes, System.Math, System.SysUtils, System.Variants, SuperObject,rmx.GUID;\n\n";

    ts += "Type\n";
    let tsIntfTmpl = Handlebars.compile(this.IntfTmplSrc, { noEscape: true });
    this.ami.childObjs.reverse().forEach((o) => {
      this.assignTemplateScope(o);
      ts += tsIntfTmpl(this.scope);
      ts += "\n";
    });

    ts += "Implementation\n\n";

    tsIntfTmpl = Handlebars.compile(this.ImplConstDefTmplSrc, { noEscape: true });
    this.ami.childObjs.reverse().forEach((o) => {
      this.assignTemplateScope(o);
      ts += tsIntfTmpl(this.scope);
      ts += "\n";
    });
    tsIntfTmpl = Handlebars.compile(this.ImplUtilsTmplSrc, { noEscape: true });
    this.ami.childObjs.reverse().forEach((o) => {
      this.assignTemplateScope(o);
      ts += tsIntfTmpl(this.scope);
      ts += "\n";
    });
    tsIntfTmpl = Handlebars.compile(this.ImplTmplSrc, { noEscape: true });
    this.ami.childObjs.reverse().forEach((o) => {
      this.assignTemplateScope(o);
      ts += tsIntfTmpl(this.scope);
      ts += "\n";
    });

    ts += "end.\n";

    return ts;
  }
}
