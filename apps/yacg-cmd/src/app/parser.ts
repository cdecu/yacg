import * as YAML from "yaml";
import { Config } from "./config";
import { AmiModel, intfModelPrintor, logHelper, TSPrintor } from "@yacg/core";
import { PascalPrintor } from "../../../../libs/core/src/lib/pascal/pascalPrintor";

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
    console.log("< Parsing", this.config.file);
    try {
      this.src = JSON.parse(txt);
    } catch (err) {
      this.src = YAML.parse(txt);
    }

    this.ami.loadFromJSON(this.config.intfName, this.config.intfDescr, this.src);
    this.trg = this.printor.printModel(this.ami);

    console.log("> Print to ", this.config.language, "\n");
    console.log(this.trg);
  }

  private createPrintor(): intfModelPrintor<AmiModel> {
    switch (this.config.language) {
      case "pascal":
        return new PascalPrintor(this.ami, this.config);
      default:
        return new TSPrintor(this.ami, this.config);
    }
  }
}
