import { ChangeDetectionStrategy, Component, VERSION } from "@angular/core";

@Component({
  selector: "yacg-footer",
  imports: [],
  templateUrl: "./footer.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  ngVersion = VERSION.full;
}
