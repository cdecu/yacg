import * as assert from 'assert';
import { convertTSIntfName } from '../lib/ts/tsUtils';

describe('convertTSIntfName', function () {
  it('should return a valid TS Interface Name', function () {
    assert.strictEqual(convertTSIntfName('Test Name'), 'Test_Name');
    assert.strictEqual(convertTSIntfName('Test-Name'), 'Test_Name');
  });
});
