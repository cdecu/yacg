import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { ParserService } from "../../app/parser.service";
import { EditorComponent } from "ngx-monaco-editor-v2";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "yacg-output",
  imports: [EditorComponent, FormsModule],
  templateUrl: "./output.html",
  styleUrl: "./output.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Output {
  public readonly formats = ["typescript", "pascal", "superobject"];

  public readonly OutputOptions = signal({
    readOnly: true,
    language: "typescript",
    minimap: {
      enabled: false,
    },
  });

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
    const language = value === "pascal" || value === "superobject" ? "pascal" : value;
    this.OutputOptions.update((options) => ({ ...options, language }));
  }
}
