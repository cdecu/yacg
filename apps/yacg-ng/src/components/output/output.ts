import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ParserService } from '../../app/parser.service';
import { EditorComponent } from 'ngx-monaco-editor-v2';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'yacg-output',
  standalone: true,
  imports: [EditorComponent, FormsModule, NgForOf],
  templateUrl: './output.html',
  styleUrl: './output.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Output {
  @ViewChild('editor') editor: any;

  public readonly formats = ['typescript', 'pascal', 'superobject'];

  public readonly OutputOptions = {
    readOnly: true,
    language: 'typescript',
    minimap: {
      enabled: false,
    },
  };

  constructor(public readonly parser: ParserService) {}

  public get selectedFmt(): string {
    return this.parser.selectedFmt();
  }
  public set selectedFmt(value: string) {
    const currentFmt = this.parser.selectedFmt();
    if (value !== currentFmt) {
      this.parser.selectedFmt.set(value);
      this.initEditorOptions(value);
    }
  }

  public get data() {
    return this.parser.output_data();
  }

  private initEditorOptions(value: string) {
    switch (value) {
      case 'pascal':
      case 'superobject':
        this.OutputOptions.language = 'pascal';
        break;
      default:
        this.OutputOptions.language = value;
        break;
    }
    this.editor.options = this.OutputOptions;
  }
}
