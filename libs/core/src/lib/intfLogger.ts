/**
 * List of known log levels. Used to specify the urgency of a log message.
 * silent, error, warn, info, verbose
 */
export const enum LogLevel {
  Silent,
  Error,
  Warn,
  Info,
  Verbose,
}

/**
 * A logger that will not produce any output.
 *
 * This logger also serves as the base class of other loggers as it implements all the required utility functions.
 */
export interface logHelper {
  error(message: any): void;
  warn(message: any): void;
  info(message: any): void;
  verbose(message: any): void;
  log(message: any): void;
}
