import * as assert from "assert";
import { convertTSIntfName, convertTSPropertyName } from "../lib/ts/tsUtils";
import { TSPrintor } from "../lib/ts/tsPrintor";

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
  const p = new TSPrintor({});
  const ami = {
    ami: <any>{},
    name: "test",
    description: "test",
    sampleSize: 0,
  };
  ami.ami = ami;
  expect(() => p.printModel(ami)).toThrow();
});
