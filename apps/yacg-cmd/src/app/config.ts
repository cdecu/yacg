import * as yargs from "yargs";
import { cosmiconfigSync } from "cosmiconfig";
import { LogLevel } from "@yacg/core";

/**
 * configuration class. Config is loaded from argv and/or configFile
 * singleton class
 */
export class Config {
  public readonly file: string;
  public readonly intfName: string;
  public readonly intfDescr: string;
  public readonly language: string;
  public readonly logLevel: LogLevel;
  private readonly config: any;

  constructor() {
    // load cmd args
    const argv = Config.yargs();
    // load config file
    const configFile = argv['configFile'];
    const explorer = cosmiconfigSync("yacg");
    const { config, filepath } = (typeof configFile === "string" ? explorer.load(configFile) : explorer.search()) || {};
    // merge config file and argv
    this.config = { ...config, ...argv };
    this.config.configFile = configFile || filepath;
    this.config.language ||= "pascal";
    this.language = this.config.language;
    this.config.intfName ||= "IMyInterface";
    this.intfName = this.config.intfName;
    this.config.intfDescr ||= "Intf Descr";
    this.intfDescr = this.config.intfDescr;
    this.config.file = this.config.file || "-";
    this.file = this.config.file;
    this.logLevel = LogLevel.Debug;
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
        language: {
          alias: "l",
          describe: "Output language (Pascal, Typescript,...)",
        },
        file: {
          alias: "f",
          describe: "Source file (- for stdin)",
        },
      })
      .help(true);

    cmdline.parse();
    cmdline.exitProcess(false).epilog("copyright 2022");

    return cmdline.argv;
  }
}
