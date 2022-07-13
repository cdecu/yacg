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

/**
 * Base Model Printor Class
 */
export class IntfModelPrintor {
  //region Template Helpers
  /**
   * Format Description
   * @param {number} indent
   * @param {string} val
   * @constructor
   * @private
   */
  public static JDocDescr(indent: number, val: string): string | null {
    if (!val) return null;
    const lines = val.split("\n");
    const prefix = " ".repeat(indent);
    if (lines.length > 1) {
      let descr = prefix + "{\n";
      lines.forEach((l) => (descr += prefix + l + "\n"));
      descr += prefix + "}\n";
      return descr;
    }
    return prefix + "// " + val + "\n";
  }
  //endregion
}
