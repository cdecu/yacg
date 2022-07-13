import * as assert from "assert";
import { convertTSIntfName } from "../lib/print2TypeScript";

describe("convertTSIntfName", function () {
  it("should return a valid TS Interface Name", function () {
    assert.strictEqual(convertTSIntfName("Test Name"), "Test_Name");
    assert.strictEqual(convertTSIntfName("Test-Name"), "Test_Name");
  });
});
