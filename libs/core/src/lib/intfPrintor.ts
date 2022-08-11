import type { AmiModel } from "./amiModel";

/**
 * Abstract Model Printor
 */
export interface intfModelPrintor {
  readonly ami: AmiModel;
  readonly config: object;

  /**
   * printModel return the typescript code declaring ...
   * @param {AmiModel} model
   * @returns {string}
   */
  printModel: () => string;
}

/**
 * Base Model Printor Class
 */
export class IntfModelPrintor {
  //region Template Helpers
  /**
   * Format Description
   */
  public static JDocDescr(indent: number, val: string): string | null {
    if (typeof val != "string" || !val) return null;
    const lines = val.split("\n");
    const prefix = " ".repeat(indent);
    if (lines.length > 1) {
      let descr = prefix + "{\n";
      lines.forEach((l) => (descr += prefix + l + "\n"));
      descr += prefix + "}\n";
      return descr;
    }
    return prefix + "// " + val;
  }

  /**
   * Format Description
   */
  public static DelphiDescr(indent: number, val1: string, val2: string): string | null {
    if (typeof val2 != "string" || !val2) return null;
    const lines = val2.split("\n");
    const prefix = " ".repeat(indent);
    if (lines.length > 1) {
      let descr = prefix + "/// <" + val1 + ">\n";
      lines.forEach((l) => (descr += prefix + "/// " + l + "\n"));
      descr += prefix + "/// </" + val1 + ">";
      return descr;
    }
    return prefix + "/// <" + val1 + ">" + val2 + "</" + val1 + ">";
  }
  //endregion
}
