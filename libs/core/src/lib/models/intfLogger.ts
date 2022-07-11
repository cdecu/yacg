/**
 * List of known log levels. Used to specify the urgency of a log message.
 */
export const enum LogLevel {
  Debug,
  Info,
  Warn,
  Error,
}

/**
 * A logger that will not produce any output.
 *
 * This logger also serves as the base class of other loggers as it implements all the required utility functions.
 */
export interface logHelper {
  /**
   * Print a log message.
   *
   * @param message  The message itself.
   * @param level  The urgency of the log message.
   */
  log(message: string, level: LogLevel): void;
  /**
   * Print a log message.
   *
   * @param message  The message itself.
   */
  info(message: any): void;
}
