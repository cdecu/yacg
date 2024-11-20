import { Injectable, signal } from '@angular/core';
import {
  AmiModel,
  InputFileIntf,
  intfModelPrintor,
  Print2PascalRecord,
  Print2PascalSO,
  Print2TypeScript,
} from '@yacg/core';
import * as YAML from 'yaml';
import { BehaviorSubject, debounceTime, filter, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class ParserService {
  private readonly ami: AmiModel;

  // selected format to be used
  public selectedFmt = signal('typescript');

  // input data to be parsed;
  public $input_data: BehaviorSubject<string> = new BehaviorSubject(`
[
{"id": 1,  "name": "item 1"},
{"id": 2, "name": "item 2" }
]
`);

  // input data converted
  public $output_data = this.$input_data.pipe(
    debounceTime(1000),
    filter((x) => !!x),
    map((x) => this.parse(x))
  );
  public output_data = toSignal(this.$output_data);

  constructor() {
    // TODO load dico from assets file or ...
    this.ami = new AmiModel({ dico: {}, outputFmt: 'typescript' });
  }

  private parse(x: string): string {
    // console.log('parse', x);
    try {
      const f: InputFileIntf = {
        intfName: 'IMyInterface',
        intfDescr: 'Intf Descr',
        file: '-',
        output: this.selectedFmt(),
        text: x,
      };

      try {
        f.json = JSON.parse(f.text || '');
      } catch {
        // this.cliLogger?.info("< Parsing " + this.config.file);
        f.json = YAML.parse(f.text || '');
      }

      this.ami.src = f;
      this.ami.loadFromJSON(f);
      const printor = this.createPrintor(f.output);
      // console.log(printor.printModel());
      return printor.printModel();
    } catch (e: any) {
      return e.message;
    }
  }

  private createPrintor(outputFmt: string): intfModelPrintor {
    switch (outputFmt) {
      case 'pascal':
        return new Print2PascalRecord(this.ami);
      case 'superobject':
      case 'pascalso':
      case 'so':
        return new Print2PascalSO(this.ami);
      default:
        return new Print2TypeScript(this.ami);
    }
  }
}