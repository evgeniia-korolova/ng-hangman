import { Component, signal } from '@angular/core';
import { LanguageSwitcher } from './language-switcher/language-switcher';
import { TranslocoPipe } from '@jsverse/transloco';
import { AuthActions } from "../../shared/auth-actions/auth-actions";

@Component({
  selector: 'app-header',
  imports: [LanguageSwitcher, TranslocoPipe, AuthActions],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {  
  readonly buttonStyle = signal<string>('button-accent-inverse');
  protected readonly title = signal('Ng-Hangman');
}
