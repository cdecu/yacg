import * as yargs from "yargs";
import { cosmiconfigSync } from "cosmiconfig";
import { ConfigDicoIntf, ConfigIntf, InputFileIntf, LogLevel } from "@yacg/core";

/**
 * configuration class. Config is loaded from argv and/or configFile
 * singleton class
 */
export class Config implements ConfigIntf {
  public readonly files: "-" | InputFileIntf[];
  public readonly outputFmt: Array<string> | string;
  public readonly logLevel: LogLevel;
  public readonly intfName: string;
  public readonly intfDescr: string;
  public readonly dico: { [key: string]: ConfigDicoIntf } = {};
  private readonly config: any;

  constructor() {
    // load cmd args
    const argv = Config.yargs();
    // load config file
    const configFile = argv["configFile"];
    const explorer = cosmiconfigSync("yacg");
    const { config, filepath } = (typeof configFile === "string" ? explorer.load(configFile) : explorer.search()) || {};
    // merge config file and argv
    this.config = { ...config, ...argv };
    this.config.configFile = configFile || filepath;
    // Move up to Config
    this.logLevel = argv["verbose"] ? LogLevel.Verbose : this.config.logLevel || LogLevel.Warn;
    this.outputFmt = this.config.outputFmt || "pascal";
    this.intfName = this.config.intfName || "IMyInterface";
    this.intfDescr = this.config.intfDescr || "Intf Descr";
    this.dico = this.config.dico || {};
    // Build files
    if (Array.isArray(this.config.files) && this.config.files.length > 0) {
      // take from array
      this.files = this.config.files.map((file) => {
        return {
          file: file.file,
          intfName: file.intfName || this.config.intfName,
          intfDescr: file.intfDescr || this.config.intfDescr,
          output: file.output,
        };
      });
    } else {
      // take from stdin
      this.files = "-";
    }
  }

  static readJsonFromStdin(): Promise<string> {
    const stdin = process.stdin;
    const inputChunks = [];

    stdin.resume();
    stdin.setEncoding("utf8");

    stdin.on("data", function (chunk) {
      inputChunks.push(chunk);
    });

    return new Promise((resolve, reject) => {
      stdin.on("end", function () {
        const txt = inputChunks.join();
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
      .options({
        configFile: {
          alias: "c",
          describe: "Configuration file (.yacgrc.json)",
        },
        outputFmt: {
          alias: "o",
          describe: "One or many Output language (Pascal, Typescript,...)",
        },
        file: {
          alias: "f",
          describe: "Source file (- for stdin)",
        },
        verbose: {
          describe: "Log all messages",
        },
        logLevel: {
          alias: "l",
          describe: "Log level (silent, error, warn, info, verbose)",
        },
      })
      .help(true);

    cmdline.parse();
    cmdline.exitProcess(false).epilog("copyright 2024");

    return cmdline.argv;
  }
}
