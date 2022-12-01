#!/usr/bin/env node

import { InputFileIntf, logHelper, LogLevel } from "@yacg/core";
import { Parser } from "./app/parser";
import { Config } from "./app/config";

/**
 * Just a Logger implementation
 */
class CliLogger implements logHelper {
  constructor(private readonly config: Config) {}

  private doLog(message, level: LogLevel = LogLevel.Info): void {
    if (level <= this.config.logLevel) {
      if (typeof message === "string" || typeof message === "string") {
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            break;
          case LogLevel.Warn:
            console.warn(message);
            break;
          case LogLevel.Info:
            console.info(message);
            break;
          default:
            console.log(message);
            break;
        }
      } else {
        switch (level) {
          case LogLevel.Error:
            console.error(JSON.stringify(message));
            break;
          case LogLevel.Warn:
            console.warn(JSON.stringify(message));
            break;
          case LogLevel.Info:
            console.info(JSON.stringify(message));
            break;
          default:
            console.log(JSON.stringify(message));
            break;
        }
      }
    }
  }

  public error = (message) => this.doLog(message, LogLevel.Error);
  public warn = (message) => this.doLog(message, LogLevel.Warn);
  public info = (message) => this.doLog(message, LogLevel.Info);
  public verbose = (message) => this.doLog(message, LogLevel.Verbose);

  public log = (message) => this.doLog(message, LogLevel.Verbose);
}

const config = new Config();
const cliLogger = new CliLogger(config);
const parser = new Parser(config, cliLogger);

if (config.files === "-") {
  Config.readJsonFromStdin().then((txt) => {
    const f: InputFileIntf = {
      file: "-",
      intfName: config.intfName,
      intfDescr: config.intfDescr,
      output: "-",
      text: txt,
    };
    parser.parse(f);
  });
} else {
  config.files.forEach((f) => {
    f.text = require("fs").readFileSync(f.file, "utf8");
    f.output ||= f.file;
    parser.parse(f);
  });
}
