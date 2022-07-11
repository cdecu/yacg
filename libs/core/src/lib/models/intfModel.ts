import { intfObjInfo } from "./intfObj";
import { intfPropr } from "./intfPropr";

/**
 * Abstract Model Info aka AMI
 */
export interface intfModel<AMI> {
  ami: intfModel<AMI>;
  name: string;
  description: string;
  rootIntf?: intfObjInfo<AMI>;
  childIntfs?: intfObjInfo<AMI>[];

  /**
   * Number of sample data used to build the AMI.
   */
  sampleSize: number;

  /**
   * add Child Object needed by subtype
   * @param val
   * @returns {intfObjInfo}
   */

  addPropr?: (val: intfPropr<AMI>) => intfObjInfo<AMI>;

  /**
   * Load from a JSON Map or Array
   * @param name
   * @param description
   * @param json
   */
  loadFromJSON?: (name: string, description: string, json: any) => void;
}
