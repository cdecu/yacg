import * as assert from 'assert';
import {
  Print2PascalSO,
  Print2TypeScript,
  IntfModelPrintor,
  AmiModelBase,
  ConfigIntf,
} from '../index';

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

  const config: ConfigIntf = {
    outputFmt: 'typescript',
    dico: {},
  };

  ami.ami = ami;
  // Load some data from TestData

  const p = new Print2TypeScript(ami, config);
  assert.strictEqual(p.printModel(), '');
});

test('PascalPrintor', () => {
  class TestPascalPrintorAmiModel extends AmiModelBase {
    ami: unknown;
  }

  const ami: TestPascalPrintorAmiModel = {
    ami: {},
    name: 'test',
    description: 'test',
    sampleSize: 0,
    addExamples: true,
    config: {} as ConfigIntf,
    childObjs: [],
  };

  const config: ConfigIntf = {
    outputFmt: 'typescript',
    dico: {},
  };

  ami.ami = ami;
  // Load some data from TestData

  const p = new Print2PascalSO(ami, config);
  expect(p.printModel().startsWith('Unit')).toBe(true);
});
