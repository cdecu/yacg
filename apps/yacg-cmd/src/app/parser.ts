import * as YAML from "yaml";
import { AmiModel, intfModelPrintor, logHelper, Print2PascalRecord, Print2TypeScript } from "@yacg/core";
import { Config } from "./config";
import { Print2PascalSO } from "../../../../libs/core/src/lib/print2PascalSO";

/**
 * Parse a YAML,JSON string into a AMI
 */
export class Parser {
  private src?: any;
  private trg?: any;
  private readonly ami: AmiModel;
  private readonly printor: intfModelPrintor<AmiModel>;

  constructor(private config: Config, private cliLogger: logHelper) {
    this.ami = new AmiModel();
    this.printor = this.createPrintor();
  }

  /**
   * Parse a YAML,JSON string into a AMI
   * @param {string} txt
   */
  parse(txt: string) {
    this.cliLogger?.info("< Parsing " + this.config.file);
    try {
      this.src = JSON.parse(txt);
    } catch (err) {
      // this.cliLogger?.info("< Parsing " + this.config.file);
      this.src = YAML.parse(txt);
    }

    this.ami.loadFromJSON(this.config.intfName, this.config.intfDescr, this.src);
    this.trg = this.printor.printModel(this.ami);

    this.cliLogger?.info("> Print to " + this.config.language);
    console.log(this.trg);
  }

  private createPrintor(): intfModelPrintor<AmiModel> {
    switch (this.config.language) {
      case "pascal":
        return new Print2PascalRecord(this.ami, this.config);
      case "superobject":
      case "pascalso":
      case "so":
        return new Print2PascalSO(this.ami, this.config);
      default:
        return new Print2TypeScript(this.ami, this.config);
    }
  }
}
