/**
 * Convert `value` to a valid TS Interface Name
 * @param {string} value
 * @returns {string}
 */
export function convertTSIntfName(value: string): string {
  const intfName = value.replaceAll(/[." -]/g, '_');
  return intfName.replaceAll(/___|__/g, '_');
}
/**
 * Convert `value` to a valid TS Property Name
 * @param {string} value
 * @returns {string}
 */
export function convertTSPropertyName(value: string): string {
  const intfName = value.replaceAll(/[." -]/g, '_');
  return intfName.replaceAll(/___|__/g, '_');
}
