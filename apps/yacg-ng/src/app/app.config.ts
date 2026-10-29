import { ApplicationConfig } from "@angular/core";
import { provideMonacoEditor } from "ngx-monaco-editor-v2";

export const appConfig: ApplicationConfig = {
  providers: [provideMonacoEditor()],
};
