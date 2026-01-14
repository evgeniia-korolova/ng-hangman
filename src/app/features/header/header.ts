import { Component, signal } from '@angular/core';
import { LanguageSwitcher } from './language-switcher/language-switcher';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-header',
  imports: [LanguageSwitcher, TranslocoPipe],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly title = signal('Ng-Hangman');
}
