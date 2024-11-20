import { Config } from '../app/config';
import * as assert from 'node:assert';

describe('valType', function () {
  const config = new Config();

  it('should return `objectTypes` for valid Value|JSON', function () {
    // TODO Add some test
    assert.notStrictEqual(config.outputFmt, '');
  });
});
