import { Component } from '@angular/core';
import { Header } from '../components/header/header';
import { Input } from '../components/input/input';
import { Output } from '../components/output/output';
import { Resources } from '../components/resources/resources';
import { Footer } from '../components/footer/footer';

@Component({
  imports: [Header, Input, Output, Resources, Footer],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
