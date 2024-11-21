import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'yacg-resources',
  imports: [NgOptimizedImage],
  templateUrl: './resources.html',
  styleUrl: './resources.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Resources {}
