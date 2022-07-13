import { intfModel } from "./intfModel";
import { intfObjInfo } from "./intfObj";

/**
 * AMI known types
 */
export const enum propertyType {
  otUnknown,
  otString,
  otBoolean,
  otInteger,
  otBigInt,
  otFloat,
  otList,
  otMap,
  otFunction,
}

/**
 * AMI Property Info.
 */
export interface intfPropr<AMI> {
  readonly ami: intfModel<AMI>;
  readonly owner: intfObjInfo<AMI>;
  name: string;
  type: propertyType;
  description: string;
  required: boolean;
  itemsType: intfPropr<AMI>;
  sampleTypes: Set<propertyType>;
  sampleValues: Set<any>;
  readonly simpleType: boolean;
  readonly onlyPrimitives: boolean;
  addSampleVal: (val: any) => intfPropr<AMI>;
}
