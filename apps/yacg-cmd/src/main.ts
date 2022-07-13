#!/usr/bin/env node

import { logHelper, LogLevel } from "@yacg/core";
import { Config } from "./app/config";
import { Parser } from "./app/parser";

/**
 * Just a Logger implementation
 */
class CliLogger implements logHelper {
  constructor(private readonly config: Config) {}

  log(message: string, level: LogLevel = LogLevel.Error): void {
    console.log(message);
  }
  info(message: any): void {
    if (this.config.logLevel <= LogLevel.Info) {
      if (typeof message === "string") {
        console.log("#", message);
      } else if (typeof message === "number") {
        console.log("#", message);
      } else {
        console.log("#", JSON.stringify(message));
      }
    }
  }
}

const config = new Config();
const cliLogger = new CliLogger(config);
const parser = new Parser(config, cliLogger);

if (config.file === "-") {
  Config.readJsonFromStdin().then((txt) => {
    parser.parse(txt);
  });
} else {
  const txt = require("fs").readFileSync(config.file, "utf8");
  parser.parse(txt);
}
