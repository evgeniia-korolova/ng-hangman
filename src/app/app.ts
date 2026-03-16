import { Component, signal } from '@angular/core';
import { MainLayout } from './layouts/main-layout/main-layout';
import { Overlay } from "./features/auth/overlay/overlay";

@Component({
  selector: 'app-root',
  imports: [MainLayout, Overlay],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('Ng-Hangman');
}
