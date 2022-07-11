import { intfModel } from "./intfModel";

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
  name: string;
  type: propertyType;
  description: string;
  required: boolean;
  subType: intfPropr<AMI>;
  sampleTypes: Set<propertyType>;
  sampleValues: Set<any>;
  readonly simpleType: boolean;
  readonly onlyPrimitives: boolean;
  addSampleVal: (val: any) => intfPropr<AMI>;
}
