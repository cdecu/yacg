import { Config } from "./config";
import { logHelper, ModelInfo, modelInfo, modelPrintor, TSPrintor } from "@yacg/core";
import * as YAML from "yaml";

/**
 * Parse a YAML,JSON string into a AMI
 */
export class Parser {
  private src?: any;
  private trg?: any;
  private readonly ami: modelInfo;
  private readonly printor: modelPrintor;

  constructor(private config: Config, private cliLogger: logHelper) {
    this.ami = new ModelInfo();
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

  private createPrintor(): modelPrintor {
    switch (this.config.language) {
      case "pascal":
        return new TSPrintor({});
      // this.printor = new PascalPrintor({});
      default:
        return new TSPrintor({});
    }
  }
}
