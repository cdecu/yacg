import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { EditorComponent } from "ngx-monaco-editor-v2";
import { FormsModule } from "@angular/forms";
import { ParserService } from "../../app/parser.service";

@Component({
  selector: "yacg-input",
  imports: [EditorComponent, FormsModule],
  templateUrl: "./input.html",
  styleUrl: "./input.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Input {
  private readonly parser = inject(ParserService);

  public readonly InputOptions = {
    language: "json",
    theme: "vs-dark",
    minimap: {
      enabled: false,
    },
  };

  public get data() {
    return this.parser.$input_data.value;
  }
  public set data(value: string) {
    this.parser.$input_data.next(value);
  }
}
