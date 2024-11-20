import * as YAML from "yaml";
import { AmiModel, ConfigIntf, InputFileIntf, intfModelPrintor, logHelper, Print2PascalRecord, Print2PascalSO, Print2TypeScript } from "@yacg/core";

/**
 * Parse a YAML,JSON string into a AMI
 */
export class Parser {
  private src?: InputFileIntf;
  private trg?: string;
  private ami: AmiModel;

  constructor(private config: ConfigIntf, private cliLogger: logHelper) {}

  /**
   * Parse a YAML,JSON string into a AMI
   * @param {InputFileIntf} f
   */
  parse(f: InputFileIntf) {
    this.cliLogger?.log("< Init " + f.file);
    this.ami = new AmiModel(this.config, this.cliLogger);
    this.src = f;
    try {
      f.json = JSON.parse(f.text);
    } catch {
      // this.cliLogger?.info("< Parsing " + this.config.file);
      f.json = YAML.parse(f.text);
    }

    this.cliLogger?.log("< Parsing " + f.file);
    this.ami.loadFromJSON(this.src);
    if (!this.ami.rootObj) {
      throw new Error("No root interface found");
    }
    if (!this.ami.childObjs || this.ami.childObjs.length == 0) {
      throw new Error("Empty Source");
    }
    this.cliLogger?.log("< Parsing done");

    this.cliLogger?.log("> Print to " + this.config.outputFmt);
    if (Array.isArray(this.config.outputFmt)) {
      this.config.outputFmt.forEach((o) => {
        this.printTo(o);
      });
    } else {
      this.printTo(this.config.outputFmt);
    }
    this.cliLogger?.log("> Print done");
  }

  private printTo(outputFmt: string): string {
    const printor = this.createPrintor(outputFmt);
    this.trg = printor.printModel();
    if (this.src.output === "-") {
      console.log(this.trg);
      return "-";
    } else {
      const output = (this.src.output || this.src.file) + printor.fileExt;
      this.cliLogger?.log("> Create " + output);
      require("fs").writeFileSync(output, this.trg);
      return output;
    }
  }

  private createPrintor(outputFmt: string): intfModelPrintor {
    switch (outputFmt) {
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
