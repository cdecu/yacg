import { propertyType } from "./intfPropr";

/**
 * Find the `value` type
 * @param {any} value
 * @returns {propertyType}
 */
export function valType(value: any): propertyType {
  // catch null and undefined
  if (value == null) return propertyType.otUnknown;

  // catch arrays
  if (Array.isArray(value)) return propertyType.otList;

  // catch simple types
  const type = typeof value;
  if (type === "boolean") return propertyType.otBoolean;
  if (type === "bigint") return propertyType.otBigInt;
  if (type === "function") return propertyType.otFunction;
  if (type === "string") return propertyType.otString;
  if (type === "number") {
    if (Number.isInteger(value)) return propertyType.otInteger;
    return propertyType.otFloat;
  }
  if (type === "object") {
    const tag = Object.prototype.toString.call(value);
    if (tag == "[object String]") return propertyType.otString;
    if (tag == "[object Number]") {
      if (Number.isInteger(value.valueOf())) return propertyType.otInteger;
      return propertyType.otFloat;
    }
    return propertyType.otMap;
  }
  return propertyType.otUnknown;
}

/**
 * Find the `value` type, trying to JSON.parse string.
 * @param {any} value
 * @returns {propertyType}
 */
export function isJson(value: unknown): propertyType {
  const t = valType(value);
  if (t != propertyType.otString) return t;
  try {
    const obj = JSON.parse(<string>value);
    const t = valType(obj);
    if (t != propertyType.otString) return t;
    const n = Number.parseFloat(obj);
    if (Number.isNaN(n)) return propertyType.otString;
    if (Number.isInteger(n)) return propertyType.otInteger;
    // TODO detect objectTypes.otBigInt;
    return propertyType.otFloat;
  } catch (e) {
    return propertyType.otString;
  }
}

/**
 * A primitive (primitive value, primitive data type) is data that is not an object and has no methods.
 * @param {propertyType} value
 * @returns {boolean}
 */
export function isPrimitive(value: propertyType): boolean {
  switch (value) {
    case propertyType.otString:
    case propertyType.otBoolean:
    case propertyType.otInteger:
    case propertyType.otBigInt:
    case propertyType.otFloat:
      return true;
  }
  return false;
}
