import { ApplicationConfig, provideZonelessChangeDetection } from "@angular/core";
import { provideMonacoEditor } from "ngx-monaco-editor-v2";

export const appConfig: ApplicationConfig = {
  providers: [provideZonelessChangeDetection(), provideMonacoEditor()],
};
