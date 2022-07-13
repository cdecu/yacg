import * as assert from "assert";
import { convertTSIntfName, convertTSPropertyName, Print2TypeScript } from "../lib/print2TypeScript";

describe("TS Printor", function () {
  it("convertTSIntfName", function () {
    assert.strictEqual(convertTSIntfName("test  ts  Intf"), "test_ts_Intf");
    assert.strictEqual(convertTSIntfName("test.ts.Intf"), "test_ts_Intf");
  });
  it("convertTSPropertyName", function () {
    assert.strictEqual(convertTSPropertyName("test  ts  Intf"), "test_ts_Intf");
    assert.strictEqual(convertTSPropertyName("test.ts.Intf"), "test_ts_Intf");
  });
});

test("TSPrintor", () => {
  const ami = {
    ami: {},
    name: "test",
    description: "test",
    sampleSize: 0,
  };
  ami.ami = ami;
  const p = new Print2TypeScript(ami, {});
  expect(() => p.printModel(ami)).toThrow();
});
