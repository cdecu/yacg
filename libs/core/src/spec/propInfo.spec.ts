import assert = require("assert");
import { isJson, valType, propertyType } from "../lib/amiUtils";

describe("valType", function () {
  it("should return `objectTypes` for valid Value|JSON", function () {
    assert.strictEqual(valType(Object("a")), propertyType.otString);
    assert.strictEqual(valType([]), propertyType.otList);
    assert.strictEqual(valType(123), propertyType.otInteger);
    assert.strictEqual(valType("123"), propertyType.otString);
    assert.strictEqual(valType(Object(123)), propertyType.otInteger);
    assert.strictEqual(valType(123.45), propertyType.otFloat);
    assert.strictEqual(valType("123.45"), propertyType.otString);
    assert.strictEqual(valType(Object(123.45)), propertyType.otFloat);
    assert.strictEqual(valType({ a: 123 }), propertyType.otMap);
    assert.strictEqual(valType([1, 2, 3, 4, 5]), propertyType.otList);
  });
});

describe("isJson", function () {
  it("should return `objectTypes` for valid Value|JSON", function () {
    assert.strictEqual(isJson(Object("a")), propertyType.otString);
    assert.strictEqual(isJson("a"), propertyType.otString);
    assert.strictEqual(isJson(123), propertyType.otInteger);
    assert.strictEqual(isJson("123"), propertyType.otInteger);
    assert.strictEqual(isJson(Object(123)), propertyType.otInteger);
    assert.strictEqual(isJson(123.45), propertyType.otFloat);
    assert.strictEqual(isJson("123.45"), propertyType.otFloat);
    assert.strictEqual(isJson(Object(123.45)), propertyType.otFloat);
    assert.strictEqual(isJson('{"a":123}'), propertyType.otMap);
    assert.strictEqual(isJson({ a: 123 }), propertyType.otMap);
    assert.strictEqual(isJson("[1,2,3,4,5]"), propertyType.otList);
    assert.strictEqual(isJson([1, 2, 3, 4, 5]), propertyType.otList);
  });
});
