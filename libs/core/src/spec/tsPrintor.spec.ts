import * as assert from 'assert';
import { Print2TypeScript } from '../lib/print2TypeScript';
import { IntfModelPrintor } from '../lib/intfPrintor';
import { AmiModelBase } from '../lib/amiModel';
import { ConfigIntf } from '../lib/amiConfig';

describe('Pascal Printor', function () {
  it('buildPascalObjName', function () {
    assert.strictEqual(
      IntfModelPrintor.buildPascalObjName('test  ts  Intf'),
      'Test_ts_Intf'
    );
    assert.strictEqual(
      IntfModelPrintor.buildPascalObjName('test.ts.Intf'),
      'Test_ts_Intf'
    );
  });
  it('buildPascalObjProprName', function () {
    assert.strictEqual(
      IntfModelPrintor.buildPascalObjProprName('test  ts  Propr'),
      'test_ts_Propr'
    );
    assert.strictEqual(
      IntfModelPrintor.buildPascalObjProprName('test.ts.Propr'),
      'test_ts_Propr'
    );
  });
});

test('TSPrintor', () => {
  class TestTSPrintorAmiModel extends AmiModelBase {
    ami: unknown;
  }

  const ami: TestTSPrintorAmiModel = {
    ami: {},
    name: 'test',
    description: 'test',
    sampleSize: 0,
    addExamples: true,
    config: {} as ConfigIntf,
    childObjs: [],
  };

  ami.ami = ami;
  const config: ConfigIntf = {
    outputFmt: 'someFormat',
    dico: {},
  };
  const p = new Print2TypeScript(ami, config);
  expect(() => p.printModel()).toThrow();
});
