Unit PlugAndPosItem;

Uses System.Classes, System.SysUtils, System.Variants, SuperObject;

Interface

Type
  /// <summary>Intf Descr</summary>
  TPlugAndPosItemField = (
    PlugAndPosItem_id,
    PlugAndPosItem_uid,
    PlugAndPosItem_azure_image1,
    PlugAndPosItem_price_vat_included,
    PlugAndPosItem_barcode,
    PlugAndPosItem_name_fr,
    PlugAndPosItem_name_en,
    PlugAndPosItem_name_nl,
    PlugAndPosItem_internal_reference,
    PlugAndPosItem_stock,
    PlugAndPosItem_creation_date,
    PlugAndPosItem_modification_date,
    PlugAndPosItem_item_level_name_fr,
    PlugAndPosItem_item_level_name_en,
    PlugAndPosItem_item_level_name_nl,
    PlugAndPosItem_item_level2_name_fr,
    PlugAndPosItem_item_level2_name_en,
    PlugAndPosItem_item_level2_name_nl,
    PlugAndPosItem_item_category_name_fr,
    PlugAndPosItem_item_category_name_en,
    PlugAndPosItem_item_category_name_nl
    );
  TPlugAndPosItemFields = Set of TPlugAndPosItemField;

  TPlugAndPosItem = Record
  public   
    const RequiredFields : TPlugAndPosItemFields = [
      PlugAndPosItem_id,
      PlugAndPosItem_uid,
      PlugAndPosItem_price_vat_included,
      PlugAndPosItem_name_fr,
      PlugAndPosItem_name_en,
      PlugAndPosItem_name_nl,
      PlugAndPosItem_stock,
      PlugAndPosItem_creation_date
      ];
  private   
    fid : integer;
    fuid : string;
    fazure_image1 : variant;
    fprice_vat_included : extended;
    fbarcode : variant;
    fname_fr : string;
    fname_en : string;
    fname_nl : string;
    finternal_reference : variant;
    fstock : boolean;
    fcreation_date : string;
    fmodification_date : variant;
    fitem_level_name_fr : string;
    fitem_level_name_en : string;
    fitem_level_name_nl : string;
    fitem_level2_name_fr : variant;
    fitem_level2_name_en : variant;
    fitem_level2_name_nl : variant;
    fitem_category_name_fr : string;
    fitem_category_name_en : string;
    fitem_category_name_nl : string;

    procedure Set_id(Const [ref] Value:integer);
    procedure Set_uid(Const [ref] Value:string);
    procedure Set_azure_image1(Const [ref] Value:variant);
    procedure Set_price_vat_included(Const [ref] Value:extended);
    procedure Set_barcode(Const [ref] Value:variant);
    procedure Set_name_fr(Const [ref] Value:string);
    procedure Set_name_en(Const [ref] Value:string);
    procedure Set_name_nl(Const [ref] Value:string);
    procedure Set_internal_reference(Const [ref] Value:variant);
    procedure Set_stock(Const [ref] Value:boolean);
    procedure Set_creation_date(Const [ref] Value:string);
    procedure Set_modification_date(Const [ref] Value:variant);
    procedure Set_item_level_name_fr(Const [ref] Value:string);
    procedure Set_item_level_name_en(Const [ref] Value:string);
    procedure Set_item_level_name_nl(Const [ref] Value:string);
    procedure Set_item_level2_name_fr(Const [ref] Value:variant);
    procedure Set_item_level2_name_en(Const [ref] Value:variant);
    procedure Set_item_level2_name_nl(Const [ref] Value:variant);
    procedure Set_item_category_name_fr(Const [ref] Value:string);
    procedure Set_item_category_name_en(Const [ref] Value:string);
    procedure Set_item_category_name_nl(Const [ref] Value:string);

  public   
    AssignedFields : TPlugAndPosItemFields;
    
    ///<summary>Is Value a Property Field</summary>
    class function Name2Field(Const Value:String;Out Field:TPlugAndPosItemField):Boolean;static;
    ///<summary>Is Propr Required</summary>
    class function ProprRequired(Const Value:String):Boolean;static;
    
    ///<summary>Clear all properties</summary>
    procedure Clear;
    ///<summary>Compare</summary>
    function Compare(Const [ref] aSource:TPlugAndPosItem):TPlugAndPosItemFields;
    ///<summary>Compare Propr Value</summary>
    Class function CompareField(Const Field:TPlugAndPosItemField;Const [ref] Obj1,Obj2:TPlugAndPosItem):Integer;static; 
    
    ///<summary>Assign from JSON Object</summary>
    procedure AssignSO(const aSource: ISuperObject);
    
    ///<summary>Build JSON Object</summary>
    function AsSO(Const AllProps:Boolean=False):ISuperObject;
    
  public   
    /// <examples>
    /// 100586
    /// 100587
    /// 100588
    /// 102547
    /// </examples>
    /// required : true
    property id : integer read fid write Set_id;
    /// <examples>
    /// "1dfbd316-f024-473e-b3ac-e34691deb419"
    /// "c70e1ccc-2c94-4afd-b70e-e2d334409e4a"
    /// "a95ff20c-dd01-4d89-a422-87dcc06a5cd6"
    /// "96dd982a-22fe-48e8-9f7f-194324f7707a"
    /// </examples>
    /// required : true
    property uid : string read fuid write Set_uid;

    /// required : false
    property azure_image1 : variant read fazure_image1 write Set_azure_image1;
    /// <examples>
    /// 1.1
    /// 0
    /// 10
    /// </examples>
    /// required : true
    property price_vat_included : extended read fprice_vat_included write Set_price_vat_included;

    /// required : false
    property barcode : variant read fbarcode write Set_barcode;
    /// <examples>
    /// "TRAVAIL IN"
    /// "TRAVAIL OUT"
    /// "Article générique"
    /// "TestFr"
    /// </examples>
    /// required : true
    property name_fr : string read fname_fr write Set_name_fr;
    /// <examples>
    /// "WORK IN"
    /// "WORK OUT"
    /// "Generiek artikel"
    /// "TestEn"
    /// </examples>
    /// required : true
    property name_en : string read fname_en write Set_name_en;
    /// <examples>
    /// "WORK IN"
    /// "WORK OUT"
    /// "Generic item"
    /// "TestNl"
    /// </examples>
    /// required : true
    property name_nl : string read fname_nl write Set_name_nl;

    /// required : false
    property internal_reference : variant read finternal_reference write Set_internal_reference;
    /// <examples>
    /// true
    /// false
    /// </examples>
    /// required : true
    property stock : boolean read fstock write Set_stock;
    /// <examples>
    /// "2022-01-24T11:21:58.14"
    /// "2022-01-24T11:21:58.613"
    /// "2022-01-24T11:21:58.897"
    /// "2022-07-20T10:43:55.983"
    /// </examples>
    /// required : true
    property creation_date : string read fcreation_date write Set_creation_date;

    /// required : false
    property modification_date : variant read fmodification_date write Set_modification_date;
    /// <examples>"Alcools"</examples>
    /// required : false
    property item_level_name_fr : string read fitem_level_name_fr write Set_item_level_name_fr;
    /// <examples>"Alcools"</examples>
    /// required : false
    property item_level_name_en : string read fitem_level_name_en write Set_item_level_name_en;
    /// <examples>"Alcools"</examples>
    /// required : false
    property item_level_name_nl : string read fitem_level_name_nl write Set_item_level_name_nl;

    /// required : false
    property item_level2_name_fr : variant read fitem_level2_name_fr write Set_item_level2_name_fr;

    /// required : false
    property item_level2_name_en : variant read fitem_level2_name_en write Set_item_level2_name_en;

    /// required : false
    property item_level2_name_nl : variant read fitem_level2_name_nl write Set_item_level2_name_nl;
    /// <examples>"Food "</examples>
    /// required : false
    property item_category_name_fr : string read fitem_category_name_fr write Set_item_category_name_fr;
    /// <examples>"Food"</examples>
    /// required : false
    property item_category_name_en : string read fitem_category_name_en write Set_item_category_name_en;
    /// <examples>"Food"</examples>
    /// required : false
    property item_category_name_nl : string read fitem_category_name_nl write Set_item_category_name_nl;
    
  end;

Implementation

  
Const 
  _JSON_id_ = 'id';
  _JSON_uid_ = 'uid';
  _JSON_azure_image1_ = 'azure_image1';
  _JSON_price_vat_included_ = 'price_vat_included';
  _JSON_barcode_ = 'barcode';
  _JSON_name_fr_ = 'name_fr';
  _JSON_name_en_ = 'name_en';
  _JSON_name_nl_ = 'name_nl';
  _JSON_internal_reference_ = 'internal_reference';
  _JSON_stock_ = 'stock';
  _JSON_creation_date_ = 'creation_date';
  _JSON_modification_date_ = 'modification_date';
  _JSON_item_level_name_fr_ = 'item_level_name_fr';
  _JSON_item_level_name_en_ = 'item_level_name_en';
  _JSON_item_level_name_nl_ = 'item_level_name_nl';
  _JSON_item_level2_name_fr_ = 'item_level2_name_fr';
  _JSON_item_level2_name_en_ = 'item_level2_name_en';
  _JSON_item_level2_name_nl_ = 'item_level2_name_nl';
  _JSON_item_category_name_fr_ = 'item_category_name_fr';
  _JSON_item_category_name_en_ = 'item_category_name_en';
  _JSON_item_category_name_nl_ = 'item_category_name_nl';
  
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
/// <summary>Intf Descr</summary>
{______________________________________________________________________________}
class function TPlugAndPosItem.Name2Field(Const Value:String;Out Field:TPlugAndPosItemField):Boolean;
Begin
  if SameText(_JSON_id_,Value) then Begin
    Field:=TPlugAndPosItemField.PlugAndPosItem_id;
    Exit(True); 
    end;
  if SameText(_JSON_uid_,Value) then Begin
    Field:=TPlugAndPosItemField.PlugAndPosItem_uid;
    Exit(True); 
    end;
  if SameText(_JSON_azure_image1_,Value) then Begin
    Field:=TPlugAndPosItemField.PlugAndPosItem_azure_image1;
    Exit(True); 
    end;
  if SameText(_JSON_price_vat_included_,Value) then Begin
    Field:=TPlugAndPosItemField.PlugAndPosItem_price_vat_included;
    Exit(True); 
    end;
  if SameText(_JSON_barcode_,Value) then Begin
    Field:=TPlugAndPosItemField.PlugAndPosItem_barcode;
    Exit(True); 
    end;
  if SameText(_JSON_name_fr_,Value) then Begin
    Field:=TPlugAndPosItemField.PlugAndPosItem_name_fr;
    Exit(True); 
    end;
  if SameText(_JSON_name_en_,Value) then Begin
    Field:=TPlugAndPosItemField.PlugAndPosItem_name_en;
    Exit(True); 
    end;
  if SameText(_JSON_name_nl_,Value) then Begin
    Field:=TPlugAndPosItemField.PlugAndPosItem_name_nl;
    Exit(True); 
    end;
  if SameText(_JSON_internal_reference_,Value) then Begin
    Field:=TPlugAndPosItemField.PlugAndPosItem_internal_reference;
    Exit(True); 
    end;
  if SameText(_JSON_stock_,Value) then Begin
    Field:=TPlugAndPosItemField.PlugAndPosItem_stock;
    Exit(True); 
    end;
  if SameText(_JSON_creation_date_,Value) then Begin
    Field:=TPlugAndPosItemField.PlugAndPosItem_creation_date;
    Exit(True); 
    end;
  if SameText(_JSON_modification_date_,Value) then Begin
    Field:=TPlugAndPosItemField.PlugAndPosItem_modification_date;
    Exit(True); 
    end;
  if SameText(_JSON_item_level_name_fr_,Value) then Begin
    Field:=TPlugAndPosItemField.PlugAndPosItem_item_level_name_fr;
    Exit(True); 
    end;
  if SameText(_JSON_item_level_name_en_,Value) then Begin
    Field:=TPlugAndPosItemField.PlugAndPosItem_item_level_name_en;
    Exit(True); 
    end;
  if SameText(_JSON_item_level_name_nl_,Value) then Begin
    Field:=TPlugAndPosItemField.PlugAndPosItem_item_level_name_nl;
    Exit(True); 
    end;
  if SameText(_JSON_item_level2_name_fr_,Value) then Begin
    Field:=TPlugAndPosItemField.PlugAndPosItem_item_level2_name_fr;
    Exit(True); 
    end;
  if SameText(_JSON_item_level2_name_en_,Value) then Begin
    Field:=TPlugAndPosItemField.PlugAndPosItem_item_level2_name_en;
    Exit(True); 
    end;
  if SameText(_JSON_item_level2_name_nl_,Value) then Begin
    Field:=TPlugAndPosItemField.PlugAndPosItem_item_level2_name_nl;
    Exit(True); 
    end;
  if SameText(_JSON_item_category_name_fr_,Value) then Begin
    Field:=TPlugAndPosItemField.PlugAndPosItem_item_category_name_fr;
    Exit(True); 
    end;
  if SameText(_JSON_item_category_name_en_,Value) then Begin
    Field:=TPlugAndPosItemField.PlugAndPosItem_item_category_name_en;
    Exit(True); 
    end;
  if SameText(_JSON_item_category_name_nl_,Value) then Begin
    Field:=TPlugAndPosItemField.PlugAndPosItem_item_category_name_nl;
    Exit(True); 
    end;
  Result:=False;
end;

class function TPlugAndPosItem.ProprRequired(Const Value:String):Boolean;
Var f:TPlugAndPosItemField;
Begin
  if Name2Field(Value,f) then Begin
    Exit(f in RequiredFields);
    end;
  Result:=False;
end;

procedure TPlugAndPosItem.Clear;
Begin
  AssignedFields:=[];
  fid := 0;
  fuid := '';
  fazure_image1 := NULL;
  fprice_vat_included := 0;
  fbarcode := NULL;
  fname_fr := '';
  fname_en := '';
  fname_nl := '';
  finternal_reference := NULL;
  fstock := False;
  fcreation_date := '';
  fmodification_date := NULL;
  fitem_level_name_fr := '';
  fitem_level_name_en := '';
  fitem_level_name_nl := '';
  fitem_level2_name_fr := NULL;
  fitem_level2_name_en := NULL;
  fitem_level2_name_nl := NULL;
  fitem_category_name_fr := '';
  fitem_category_name_en := '';
  fitem_category_name_nl := '';
end;

Class function TPlugAndPosItem.CompareField(Const Field:TPlugAndPosItemField;Const [ref] Obj1,Obj2:TPlugAndPosItem):Integer; 
Begin 
  Case Field of 
  TPlugAndPosItemField.PlugAndPosItem_id:Begin
    Result := CompareValue(obj1.id,obj2.id);
    end;
  TPlugAndPosItemField.PlugAndPosItem_uid:Begin
    Result := CompareStr(obj1.uid,obj2.uid);
    end;
  TPlugAndPosItemField.PlugAndPosItem_azure_image1:Begin
    Result := CompareValue(obj1.azure_image1,obj2.azure_image1);
    end;
  TPlugAndPosItemField.PlugAndPosItem_price_vat_included:Begin
    Result := CompareValue(obj1.price_vat_included,obj2.price_vat_included);
    end;
  TPlugAndPosItemField.PlugAndPosItem_barcode:Begin
    Result := CompareValue(obj1.barcode,obj2.barcode);
    end;
  TPlugAndPosItemField.PlugAndPosItem_name_fr:Begin
    Result := CompareStr(obj1.name_fr,obj2.name_fr);
    end;
  TPlugAndPosItemField.PlugAndPosItem_name_en:Begin
    Result := CompareStr(obj1.name_en,obj2.name_en);
    end;
  TPlugAndPosItemField.PlugAndPosItem_name_nl:Begin
    Result := CompareStr(obj1.name_nl,obj2.name_nl);
    end;
  TPlugAndPosItemField.PlugAndPosItem_internal_reference:Begin
    Result := CompareValue(obj1.internal_reference,obj2.internal_reference);
    end;
  TPlugAndPosItemField.PlugAndPosItem_stock:Begin
    Result := Ord(obj1.stock) - Ord(obj2.stock);
    end;
  TPlugAndPosItemField.PlugAndPosItem_creation_date:Begin
    Result := CompareStr(obj1.creation_date,obj2.creation_date);
    end;
  TPlugAndPosItemField.PlugAndPosItem_modification_date:Begin
    Result := CompareValue(obj1.modification_date,obj2.modification_date);
    end;
  TPlugAndPosItemField.PlugAndPosItem_item_level_name_fr:Begin
    Result := CompareStr(obj1.item_level_name_fr,obj2.item_level_name_fr);
    end;
  TPlugAndPosItemField.PlugAndPosItem_item_level_name_en:Begin
    Result := CompareStr(obj1.item_level_name_en,obj2.item_level_name_en);
    end;
  TPlugAndPosItemField.PlugAndPosItem_item_level_name_nl:Begin
    Result := CompareStr(obj1.item_level_name_nl,obj2.item_level_name_nl);
    end;
  TPlugAndPosItemField.PlugAndPosItem_item_level2_name_fr:Begin
    Result := CompareValue(obj1.item_level2_name_fr,obj2.item_level2_name_fr);
    end;
  TPlugAndPosItemField.PlugAndPosItem_item_level2_name_en:Begin
    Result := CompareValue(obj1.item_level2_name_en,obj2.item_level2_name_en);
    end;
  TPlugAndPosItemField.PlugAndPosItem_item_level2_name_nl:Begin
    Result := CompareValue(obj1.item_level2_name_nl,obj2.item_level2_name_nl);
    end;
  TPlugAndPosItemField.PlugAndPosItem_item_category_name_fr:Begin
    Result := CompareStr(obj1.item_category_name_fr,obj2.item_category_name_fr);
    end;
  TPlugAndPosItemField.PlugAndPosItem_item_category_name_en:Begin
    Result := CompareStr(obj1.item_category_name_en,obj2.item_category_name_en);
    end;
  TPlugAndPosItemField.PlugAndPosItem_item_category_name_nl:Begin
    Result := CompareStr(obj1.item_category_name_nl,obj2.item_category_name_nl);
    end;
  else Begin
    Assert(False);
    result:=0;
  end end; 
end;

function TPlugAndPosItem.Compare(Const [ref] aSource:TPlugAndPosItem):TPlugAndPosItemFields;
Begin
  Result:=[];
  if (CompareField(TPlugAndPosItemField.PlugAndPosItem_id,Self,aSource)<>0) then Begin
    Include(Result,TPlugAndPosItemField.PlugAndPosItem_id);
    end;
    
  if (CompareField(TPlugAndPosItemField.PlugAndPosItem_uid,Self,aSource)<>0) then Begin
    Include(Result,TPlugAndPosItemField.PlugAndPosItem_uid);
    end;
    
  if (CompareField(TPlugAndPosItemField.PlugAndPosItem_azure_image1,Self,aSource)<>0) then Begin
    Include(Result,TPlugAndPosItemField.PlugAndPosItem_azure_image1);
    end;
    
  if (CompareField(TPlugAndPosItemField.PlugAndPosItem_price_vat_included,Self,aSource)<>0) then Begin
    Include(Result,TPlugAndPosItemField.PlugAndPosItem_price_vat_included);
    end;
    
  if (CompareField(TPlugAndPosItemField.PlugAndPosItem_barcode,Self,aSource)<>0) then Begin
    Include(Result,TPlugAndPosItemField.PlugAndPosItem_barcode);
    end;
    
  if (CompareField(TPlugAndPosItemField.PlugAndPosItem_name_fr,Self,aSource)<>0) then Begin
    Include(Result,TPlugAndPosItemField.PlugAndPosItem_name_fr);
    end;
    
  if (CompareField(TPlugAndPosItemField.PlugAndPosItem_name_en,Self,aSource)<>0) then Begin
    Include(Result,TPlugAndPosItemField.PlugAndPosItem_name_en);
    end;
    
  if (CompareField(TPlugAndPosItemField.PlugAndPosItem_name_nl,Self,aSource)<>0) then Begin
    Include(Result,TPlugAndPosItemField.PlugAndPosItem_name_nl);
    end;
    
  if (CompareField(TPlugAndPosItemField.PlugAndPosItem_internal_reference,Self,aSource)<>0) then Begin
    Include(Result,TPlugAndPosItemField.PlugAndPosItem_internal_reference);
    end;
    
  if (CompareField(TPlugAndPosItemField.PlugAndPosItem_stock,Self,aSource)<>0) then Begin
    Include(Result,TPlugAndPosItemField.PlugAndPosItem_stock);
    end;
    
  if (CompareField(TPlugAndPosItemField.PlugAndPosItem_creation_date,Self,aSource)<>0) then Begin
    Include(Result,TPlugAndPosItemField.PlugAndPosItem_creation_date);
    end;
    
  if (CompareField(TPlugAndPosItemField.PlugAndPosItem_modification_date,Self,aSource)<>0) then Begin
    Include(Result,TPlugAndPosItemField.PlugAndPosItem_modification_date);
    end;
    
  if (CompareField(TPlugAndPosItemField.PlugAndPosItem_item_level_name_fr,Self,aSource)<>0) then Begin
    Include(Result,TPlugAndPosItemField.PlugAndPosItem_item_level_name_fr);
    end;
    
  if (CompareField(TPlugAndPosItemField.PlugAndPosItem_item_level_name_en,Self,aSource)<>0) then Begin
    Include(Result,TPlugAndPosItemField.PlugAndPosItem_item_level_name_en);
    end;
    
  if (CompareField(TPlugAndPosItemField.PlugAndPosItem_item_level_name_nl,Self,aSource)<>0) then Begin
    Include(Result,TPlugAndPosItemField.PlugAndPosItem_item_level_name_nl);
    end;
    
  if (CompareField(TPlugAndPosItemField.PlugAndPosItem_item_level2_name_fr,Self,aSource)<>0) then Begin
    Include(Result,TPlugAndPosItemField.PlugAndPosItem_item_level2_name_fr);
    end;
    
  if (CompareField(TPlugAndPosItemField.PlugAndPosItem_item_level2_name_en,Self,aSource)<>0) then Begin
    Include(Result,TPlugAndPosItemField.PlugAndPosItem_item_level2_name_en);
    end;
    
  if (CompareField(TPlugAndPosItemField.PlugAndPosItem_item_level2_name_nl,Self,aSource)<>0) then Begin
    Include(Result,TPlugAndPosItemField.PlugAndPosItem_item_level2_name_nl);
    end;
    
  if (CompareField(TPlugAndPosItemField.PlugAndPosItem_item_category_name_fr,Self,aSource)<>0) then Begin
    Include(Result,TPlugAndPosItemField.PlugAndPosItem_item_category_name_fr);
    end;
    
  if (CompareField(TPlugAndPosItemField.PlugAndPosItem_item_category_name_en,Self,aSource)<>0) then Begin
    Include(Result,TPlugAndPosItemField.PlugAndPosItem_item_category_name_en);
    end;
    
  if (CompareField(TPlugAndPosItemField.PlugAndPosItem_item_category_name_nl,Self,aSource)<>0) then Begin
    Include(Result,TPlugAndPosItemField.PlugAndPosItem_item_category_name_nl);
    end;
    
end;  

procedure TPlugAndPosItem.AssignSO(const aSource: ISuperObject);
Begin
  Self.Clear;
  
  /// <examples>
  /// 100586
  /// 100587
  /// 100588
  /// 102547
  /// </examples>
  Begin 
    var obj:ISuperObject;
    obj := aSource.O[_JSON_id_];
    if obj<>nil then Begin
      Include(AssignedFields,TPlugAndPosItemField.PlugAndPosItem_id);
      self.fid := obj.AsInteger;;
  end end;
        
  /// <examples>
  /// "1dfbd316-f024-473e-b3ac-e34691deb419"
  /// "c70e1ccc-2c94-4afd-b70e-e2d334409e4a"
  /// "a95ff20c-dd01-4d89-a422-87dcc06a5cd6"
  /// "96dd982a-22fe-48e8-9f7f-194324f7707a"
  /// </examples>
  Begin 
    var obj:ISuperObject;
    obj := aSource.O[_JSON_uid_];
    if obj<>nil then Begin
      Include(AssignedFields,TPlugAndPosItemField.PlugAndPosItem_uid);
      self.fuid := obj.AsString;;
  end end;
        

  Begin 
    var obj:ISuperObject;
    obj := aSource.O[_JSON_azure_image1_];
    if obj<>nil then Begin
      Include(AssignedFields,TPlugAndPosItemField.PlugAndPosItem_azure_image1);
      self.fazure_image1 := ObjAsVariant(obj);;
  end end;
        
  /// <examples>
  /// 1.1
  /// 0
  /// 10
  /// </examples>
  Begin 
    var obj:ISuperObject;
    obj := aSource.O[_JSON_price_vat_included_];
    if obj<>nil then Begin
      Include(AssignedFields,TPlugAndPosItemField.PlugAndPosItem_price_vat_included);
      self.fprice_vat_included := obj.AsDouble;;
  end end;
        

  Begin 
    var obj:ISuperObject;
    obj := aSource.O[_JSON_barcode_];
    if obj<>nil then Begin
      Include(AssignedFields,TPlugAndPosItemField.PlugAndPosItem_barcode);
      self.fbarcode := ObjAsVariant(obj);;
  end end;
        
  /// <examples>
  /// "TRAVAIL IN"
  /// "TRAVAIL OUT"
  /// "Article générique"
  /// "TestFr"
  /// </examples>
  Begin 
    var obj:ISuperObject;
    obj := aSource.O[_JSON_name_fr_];
    if obj<>nil then Begin
      Include(AssignedFields,TPlugAndPosItemField.PlugAndPosItem_name_fr);
      self.fname_fr := obj.AsString;;
  end end;
        
  /// <examples>
  /// "WORK IN"
  /// "WORK OUT"
  /// "Generiek artikel"
  /// "TestEn"
  /// </examples>
  Begin 
    var obj:ISuperObject;
    obj := aSource.O[_JSON_name_en_];
    if obj<>nil then Begin
      Include(AssignedFields,TPlugAndPosItemField.PlugAndPosItem_name_en);
      self.fname_en := obj.AsString;;
  end end;
        
  /// <examples>
  /// "WORK IN"
  /// "WORK OUT"
  /// "Generic item"
  /// "TestNl"
  /// </examples>
  Begin 
    var obj:ISuperObject;
    obj := aSource.O[_JSON_name_nl_];
    if obj<>nil then Begin
      Include(AssignedFields,TPlugAndPosItemField.PlugAndPosItem_name_nl);
      self.fname_nl := obj.AsString;;
  end end;
        

  Begin 
    var obj:ISuperObject;
    obj := aSource.O[_JSON_internal_reference_];
    if obj<>nil then Begin
      Include(AssignedFields,TPlugAndPosItemField.PlugAndPosItem_internal_reference);
      self.finternal_reference := ObjAsVariant(obj);;
  end end;
        
  /// <examples>
  /// true
  /// false
  /// </examples>
  Begin 
    var obj:ISuperObject;
    obj := aSource.O[_JSON_stock_];
    if obj<>nil then Begin
      Include(AssignedFields,TPlugAndPosItemField.PlugAndPosItem_stock);
      self.fstock := obj.AsBoolean;;
  end end;
        
  /// <examples>
  /// "2022-01-24T11:21:58.14"
  /// "2022-01-24T11:21:58.613"
  /// "2022-01-24T11:21:58.897"
  /// "2022-07-20T10:43:55.983"
  /// </examples>
  Begin 
    var obj:ISuperObject;
    obj := aSource.O[_JSON_creation_date_];
    if obj<>nil then Begin
      Include(AssignedFields,TPlugAndPosItemField.PlugAndPosItem_creation_date);
      self.fcreation_date := obj.AsString;;
  end end;
        

  Begin 
    var obj:ISuperObject;
    obj := aSource.O[_JSON_modification_date_];
    if obj<>nil then Begin
      Include(AssignedFields,TPlugAndPosItemField.PlugAndPosItem_modification_date);
      self.fmodification_date := ObjAsVariant(obj);;
  end end;
        
  /// <examples>"Alcools"</examples>
  Begin 
    var obj:ISuperObject;
    obj := aSource.O[_JSON_item_level_name_fr_];
    if obj<>nil then Begin
      Include(AssignedFields,TPlugAndPosItemField.PlugAndPosItem_item_level_name_fr);
      self.fitem_level_name_fr := obj.AsString;;
  end end;
        
  /// <examples>"Alcools"</examples>
  Begin 
    var obj:ISuperObject;
    obj := aSource.O[_JSON_item_level_name_en_];
    if obj<>nil then Begin
      Include(AssignedFields,TPlugAndPosItemField.PlugAndPosItem_item_level_name_en);
      self.fitem_level_name_en := obj.AsString;;
  end end;
        
  /// <examples>"Alcools"</examples>
  Begin 
    var obj:ISuperObject;
    obj := aSource.O[_JSON_item_level_name_nl_];
    if obj<>nil then Begin
      Include(AssignedFields,TPlugAndPosItemField.PlugAndPosItem_item_level_name_nl);
      self.fitem_level_name_nl := obj.AsString;;
  end end;
        

  Begin 
    var obj:ISuperObject;
    obj := aSource.O[_JSON_item_level2_name_fr_];
    if obj<>nil then Begin
      Include(AssignedFields,TPlugAndPosItemField.PlugAndPosItem_item_level2_name_fr);
      self.fitem_level2_name_fr := ObjAsVariant(obj);;
  end end;
        

  Begin 
    var obj:ISuperObject;
    obj := aSource.O[_JSON_item_level2_name_en_];
    if obj<>nil then Begin
      Include(AssignedFields,TPlugAndPosItemField.PlugAndPosItem_item_level2_name_en);
      self.fitem_level2_name_en := ObjAsVariant(obj);;
  end end;
        

  Begin 
    var obj:ISuperObject;
    obj := aSource.O[_JSON_item_level2_name_nl_];
    if obj<>nil then Begin
      Include(AssignedFields,TPlugAndPosItemField.PlugAndPosItem_item_level2_name_nl);
      self.fitem_level2_name_nl := ObjAsVariant(obj);;
  end end;
        
  /// <examples>"Food "</examples>
  Begin 
    var obj:ISuperObject;
    obj := aSource.O[_JSON_item_category_name_fr_];
    if obj<>nil then Begin
      Include(AssignedFields,TPlugAndPosItemField.PlugAndPosItem_item_category_name_fr);
      self.fitem_category_name_fr := obj.AsString;;
  end end;
        
  /// <examples>"Food"</examples>
  Begin 
    var obj:ISuperObject;
    obj := aSource.O[_JSON_item_category_name_en_];
    if obj<>nil then Begin
      Include(AssignedFields,TPlugAndPosItemField.PlugAndPosItem_item_category_name_en);
      self.fitem_category_name_en := obj.AsString;;
  end end;
        
  /// <examples>"Food"</examples>
  Begin 
    var obj:ISuperObject;
    obj := aSource.O[_JSON_item_category_name_nl_];
    if obj<>nil then Begin
      Include(AssignedFields,TPlugAndPosItemField.PlugAndPosItem_item_category_name_nl);
      self.fitem_category_name_nl := obj.AsString;;
  end end;
        
end;

///<summary>Build JSON Object</summary>
function TPlugAndPosItem.AsSO(Const AllProps:Boolean=False):ISuperObject;
Var o:TSuperTableString;
Begin
  Result:=TSuperObject.Create(stObject);
  o:=Result.AsObject;

  /// <examples>
  /// 100586
  /// 100587
  /// 100588
  /// 102547
  /// </examples>
  if (AllProps) or ( TPlugAndPosItemField.PlugAndPosItem_id in AssignedFields) then Begin   
    o.I[_JSON_id_] := Self.id;
    end;
    
  /// <examples>
  /// "1dfbd316-f024-473e-b3ac-e34691deb419"
  /// "c70e1ccc-2c94-4afd-b70e-e2d334409e4a"
  /// "a95ff20c-dd01-4d89-a422-87dcc06a5cd6"
  /// "96dd982a-22fe-48e8-9f7f-194324f7707a"
  /// </examples>
  if (AllProps) or ( TPlugAndPosItemField.PlugAndPosItem_uid in AssignedFields) then Begin   
    o.S[_JSON_uid_] := Self.uid;
    end;
    

  if (AllProps) or ( TPlugAndPosItemField.PlugAndPosItem_azure_image1 in AssignedFields) then Begin   
    o.O[_JSON_azure_image1_] := SuperObject.SObj(Self.azure_image1);
    end;
    
  /// <examples>
  /// 1.1
  /// 0
  /// 10
  /// </examples>
  if (AllProps) or ( TPlugAndPosItemField.PlugAndPosItem_price_vat_included in AssignedFields) then Begin   
    o.D[_JSON_price_vat_included_] := Self.price_vat_included;
    end;
    

  if (AllProps) or ( TPlugAndPosItemField.PlugAndPosItem_barcode in AssignedFields) then Begin   
    o.O[_JSON_barcode_] := SuperObject.SObj(Self.barcode);
    end;
    
  /// <examples>
  /// "TRAVAIL IN"
  /// "TRAVAIL OUT"
  /// "Article générique"
  /// "TestFr"
  /// </examples>
  if (AllProps) or ( TPlugAndPosItemField.PlugAndPosItem_name_fr in AssignedFields) then Begin   
    o.S[_JSON_name_fr_] := Self.name_fr;
    end;
    
  /// <examples>
  /// "WORK IN"
  /// "WORK OUT"
  /// "Generiek artikel"
  /// "TestEn"
  /// </examples>
  if (AllProps) or ( TPlugAndPosItemField.PlugAndPosItem_name_en in AssignedFields) then Begin   
    o.S[_JSON_name_en_] := Self.name_en;
    end;
    
  /// <examples>
  /// "WORK IN"
  /// "WORK OUT"
  /// "Generic item"
  /// "TestNl"
  /// </examples>
  if (AllProps) or ( TPlugAndPosItemField.PlugAndPosItem_name_nl in AssignedFields) then Begin   
    o.S[_JSON_name_nl_] := Self.name_nl;
    end;
    

  if (AllProps) or ( TPlugAndPosItemField.PlugAndPosItem_internal_reference in AssignedFields) then Begin   
    o.O[_JSON_internal_reference_] := SuperObject.SObj(Self.internal_reference);
    end;
    
  /// <examples>
  /// true
  /// false
  /// </examples>
  if (AllProps) or ( TPlugAndPosItemField.PlugAndPosItem_stock in AssignedFields) then Begin   
    o.B[_JSON_stock_] := Self.stock;
    end;
    
  /// <examples>
  /// "2022-01-24T11:21:58.14"
  /// "2022-01-24T11:21:58.613"
  /// "2022-01-24T11:21:58.897"
  /// "2022-07-20T10:43:55.983"
  /// </examples>
  if (AllProps) or ( TPlugAndPosItemField.PlugAndPosItem_creation_date in AssignedFields) then Begin   
    o.S[_JSON_creation_date_] := Self.creation_date;
    end;
    

  if (AllProps) or ( TPlugAndPosItemField.PlugAndPosItem_modification_date in AssignedFields) then Begin   
    o.O[_JSON_modification_date_] := SuperObject.SObj(Self.modification_date);
    end;
    
  /// <examples>"Alcools"</examples>
  if (AllProps) or ( TPlugAndPosItemField.PlugAndPosItem_item_level_name_fr in AssignedFields) then Begin   
    o.S[_JSON_item_level_name_fr_] := Self.item_level_name_fr;
    end;
    
  /// <examples>"Alcools"</examples>
  if (AllProps) or ( TPlugAndPosItemField.PlugAndPosItem_item_level_name_en in AssignedFields) then Begin   
    o.S[_JSON_item_level_name_en_] := Self.item_level_name_en;
    end;
    
  /// <examples>"Alcools"</examples>
  if (AllProps) or ( TPlugAndPosItemField.PlugAndPosItem_item_level_name_nl in AssignedFields) then Begin   
    o.S[_JSON_item_level_name_nl_] := Self.item_level_name_nl;
    end;
    

  if (AllProps) or ( TPlugAndPosItemField.PlugAndPosItem_item_level2_name_fr in AssignedFields) then Begin   
    o.O[_JSON_item_level2_name_fr_] := SuperObject.SObj(Self.item_level2_name_fr);
    end;
    

  if (AllProps) or ( TPlugAndPosItemField.PlugAndPosItem_item_level2_name_en in AssignedFields) then Begin   
    o.O[_JSON_item_level2_name_en_] := SuperObject.SObj(Self.item_level2_name_en);
    end;
    

  if (AllProps) or ( TPlugAndPosItemField.PlugAndPosItem_item_level2_name_nl in AssignedFields) then Begin   
    o.O[_JSON_item_level2_name_nl_] := SuperObject.SObj(Self.item_level2_name_nl);
    end;
    
  /// <examples>"Food "</examples>
  if (AllProps) or ( TPlugAndPosItemField.PlugAndPosItem_item_category_name_fr in AssignedFields) then Begin   
    o.S[_JSON_item_category_name_fr_] := Self.item_category_name_fr;
    end;
    
  /// <examples>"Food"</examples>
  if (AllProps) or ( TPlugAndPosItemField.PlugAndPosItem_item_category_name_en in AssignedFields) then Begin   
    o.S[_JSON_item_category_name_en_] := Self.item_category_name_en;
    end;
    
  /// <examples>"Food"</examples>
  if (AllProps) or ( TPlugAndPosItemField.PlugAndPosItem_item_category_name_nl in AssignedFields) then Begin   
    o.S[_JSON_item_category_name_nl_] := Self.item_category_name_nl;
    end;
    
end;

procedure TPlugAndPosItem.Set_id(Const [ref] Value:integer);
Begin
  Include(AssignedFields,TPlugAndPosItemField.PlugAndPosItem_id);
  Self.fid:=Value;
end;
procedure TPlugAndPosItem.Set_uid(Const [ref] Value:string);
Begin
  Include(AssignedFields,TPlugAndPosItemField.PlugAndPosItem_uid);
  Self.fuid:=Value;
end;
procedure TPlugAndPosItem.Set_azure_image1(Const [ref] Value:variant);
Begin
  Include(AssignedFields,TPlugAndPosItemField.PlugAndPosItem_azure_image1);
  Self.fazure_image1:=Value;
end;
procedure TPlugAndPosItem.Set_price_vat_included(Const [ref] Value:extended);
Begin
  Include(AssignedFields,TPlugAndPosItemField.PlugAndPosItem_price_vat_included);
  Self.fprice_vat_included:=Value;
end;
procedure TPlugAndPosItem.Set_barcode(Const [ref] Value:variant);
Begin
  Include(AssignedFields,TPlugAndPosItemField.PlugAndPosItem_barcode);
  Self.fbarcode:=Value;
end;
procedure TPlugAndPosItem.Set_name_fr(Const [ref] Value:string);
Begin
  Include(AssignedFields,TPlugAndPosItemField.PlugAndPosItem_name_fr);
  Self.fname_fr:=Value;
end;
procedure TPlugAndPosItem.Set_name_en(Const [ref] Value:string);
Begin
  Include(AssignedFields,TPlugAndPosItemField.PlugAndPosItem_name_en);
  Self.fname_en:=Value;
end;
procedure TPlugAndPosItem.Set_name_nl(Const [ref] Value:string);
Begin
  Include(AssignedFields,TPlugAndPosItemField.PlugAndPosItem_name_nl);
  Self.fname_nl:=Value;
end;
procedure TPlugAndPosItem.Set_internal_reference(Const [ref] Value:variant);
Begin
  Include(AssignedFields,TPlugAndPosItemField.PlugAndPosItem_internal_reference);
  Self.finternal_reference:=Value;
end;
procedure TPlugAndPosItem.Set_stock(Const [ref] Value:boolean);
Begin
  Include(AssignedFields,TPlugAndPosItemField.PlugAndPosItem_stock);
  Self.fstock:=Value;
end;
procedure TPlugAndPosItem.Set_creation_date(Const [ref] Value:string);
Begin
  Include(AssignedFields,TPlugAndPosItemField.PlugAndPosItem_creation_date);
  Self.fcreation_date:=Value;
end;
procedure TPlugAndPosItem.Set_modification_date(Const [ref] Value:variant);
Begin
  Include(AssignedFields,TPlugAndPosItemField.PlugAndPosItem_modification_date);
  Self.fmodification_date:=Value;
end;
procedure TPlugAndPosItem.Set_item_level_name_fr(Const [ref] Value:string);
Begin
  Include(AssignedFields,TPlugAndPosItemField.PlugAndPosItem_item_level_name_fr);
  Self.fitem_level_name_fr:=Value;
end;
procedure TPlugAndPosItem.Set_item_level_name_en(Const [ref] Value:string);
Begin
  Include(AssignedFields,TPlugAndPosItemField.PlugAndPosItem_item_level_name_en);
  Self.fitem_level_name_en:=Value;
end;
procedure TPlugAndPosItem.Set_item_level_name_nl(Const [ref] Value:string);
Begin
  Include(AssignedFields,TPlugAndPosItemField.PlugAndPosItem_item_level_name_nl);
  Self.fitem_level_name_nl:=Value;
end;
procedure TPlugAndPosItem.Set_item_level2_name_fr(Const [ref] Value:variant);
Begin
  Include(AssignedFields,TPlugAndPosItemField.PlugAndPosItem_item_level2_name_fr);
  Self.fitem_level2_name_fr:=Value;
end;
procedure TPlugAndPosItem.Set_item_level2_name_en(Const [ref] Value:variant);
Begin
  Include(AssignedFields,TPlugAndPosItemField.PlugAndPosItem_item_level2_name_en);
  Self.fitem_level2_name_en:=Value;
end;
procedure TPlugAndPosItem.Set_item_level2_name_nl(Const [ref] Value:variant);
Begin
  Include(AssignedFields,TPlugAndPosItemField.PlugAndPosItem_item_level2_name_nl);
  Self.fitem_level2_name_nl:=Value;
end;
procedure TPlugAndPosItem.Set_item_category_name_fr(Const [ref] Value:string);
Begin
  Include(AssignedFields,TPlugAndPosItemField.PlugAndPosItem_item_category_name_fr);
  Self.fitem_category_name_fr:=Value;
end;
procedure TPlugAndPosItem.Set_item_category_name_en(Const [ref] Value:string);
Begin
  Include(AssignedFields,TPlugAndPosItemField.PlugAndPosItem_item_category_name_en);
  Self.fitem_category_name_en:=Value;
end;
procedure TPlugAndPosItem.Set_item_category_name_nl(Const [ref] Value:string);
Begin
  Include(AssignedFields,TPlugAndPosItemField.PlugAndPosItem_item_category_name_nl);
  Self.fitem_category_name_nl:=Value;
end;

end.

