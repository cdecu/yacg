/**
 * One file to be parsed configuration
 */
export interface InputFileIntf {
  file: string;
  output: string;
  intfName: string;
  intfDescr: string;
  text?: string;
  json?: any;
}

/**
 * Global Dico
 */
export interface ConfigDicoIntf {
  defaultType?: string;
}

/**
 * Global config
 */
export interface ConfigIntf {
  description?: string;
  outputFmt: Array<string> | string;
  dico: { [key: string]: ConfigDicoIntf };
}
