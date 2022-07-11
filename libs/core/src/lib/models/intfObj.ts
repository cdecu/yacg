import { intfPropr } from "./intfPropr";
import { intfModel } from "./intfModel";

/**
 * AMI Object Info. An Object is (for us) just a list of properties.
 */
export interface intfObjInfo<AMI> {
  ami: intfModel<AMI>;
  name: string;
  description: string;
  properties: intfPropr<AMI>[];
  /**
   * Number of sample data used to build the AMI.
   */
  sampleSize: number;
  addSampleProperty: (key: string, val: unknown) => intfPropr<AMI>;
  /**
   * Detect properties type from sample values
   */
  detectTypes: (model: intfModel<AMI>) => void;

  /**
   * Initialize and clear properties
   */
  clear(name: string, description: string): void;
}
