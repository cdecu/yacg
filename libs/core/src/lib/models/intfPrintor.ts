import { intfModel } from "./intfModel";

/**
 * Abstract Model Printor
 */
export interface intfModelPrintor<AMI> {
  readonly ami: intfModel<AMI>;
  readonly config: object;

  /**
   * printModel return the typescript code declaring ...
   * @param {intfModel} model
   * @returns {string}
   */
  printModel: (model: intfModel<AMI>) => string;
}
