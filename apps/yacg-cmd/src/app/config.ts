import * as yargs from "yargs";
import { cosmiconfigSync } from "cosmiconfig";

/**
 * configuration class. Config is loaded from argv and/or configFile
 * singleton class
 */
export class Config {
  private readonly config: any;
  public readonly file: string;
  public readonly intfName: string;
  public readonly intfDescr: string;
  public readonly language: string;

  constructor() {
    // load cmd args
    const argv = Config.yargs();
    // load config file
    const configFile = argv.configFile;
    const explorer = cosmiconfigSync("yacg");
    const { config, filepath } = (typeof configFile === "string" ? explorer.load(configFile) : explorer.search()) || {};
    // merge config file and argv
    this.config = { ...config, ...argv };
    this.config.configFile = configFile || filepath;
    this.config.output ||= {};
    this.config.output.language ||= "pascal";
    this.config.output.intfName ||= "IMyInterface";
    this.config.output.intfDescr ||= "Intf Descr";
    this.language = this.config.output.language;
    this.intfName = this.config.output.intfName;
    this.intfDescr = this.config.output.intfDescr;
    this.file = this.config.file || "-";
  }

  private static yargs() {
    const cmdline = yargs
      .env("YACG")
      .wrap(yargs.terminalWidth())
      .scriptName("yacg-cmd")
      .usage("$0 <cmd> [args]")
      .version()
      .alias("v", "version")
      .options({
        configFile: {
          alias: "c",
          describe: "Configuration file (.yacgrc.json)",
        },
        file: {
          alias: "f",
          describe: "Source file (- for stdin)",
        },
      });

    cmdline.parse();
    cmdline.showHelp().exitProcess(false).epilog("copyright 2022");

    return cmdline.argv;
  }

  static readJsonFromStdin(): Promise<string> {
    let stdin = process.stdin;
    let inputChunks = [];

    stdin.resume();
    stdin.setEncoding("utf8");

    stdin.on("data", function (chunk) {
      inputChunks.push(chunk);
    });

    return new Promise((resolve, reject) => {
      stdin.on("end", function () {
        let txt = inputChunks.join();
        resolve(txt);
      });
      stdin.on("error", function () {
        reject(Error("error during read"));
      });
      stdin.on("timeout", function () {
        reject(Error("timout during read"));
      });
    });
  }
}
