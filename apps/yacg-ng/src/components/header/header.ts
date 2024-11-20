import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MdoButtonModule } from '@ctrl/ngx-github-buttons';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'yacg-header',
  standalone: true,
  imports: [MdoButtonModule, NgOptimizedImage],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {}
