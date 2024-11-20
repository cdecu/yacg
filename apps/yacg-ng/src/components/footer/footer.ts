
import { ChangeDetectionStrategy, Component, VERSION } from '@angular/core';

@Component({
  selector: 'yacg-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class Footer {
  ngVersion = VERSION.full;
}
