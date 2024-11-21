import { ChangeDetectionStrategy, Component, VERSION } from '@angular/core';

@Component({
  selector: 'yacg-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  ngVersion = VERSION.full;
}
