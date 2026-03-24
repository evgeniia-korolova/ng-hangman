import { Component, inject, Renderer2, signal } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { AuthActions } from "../../../shared/auth-actions/auth-actions";
import { CustomSelect } from "../../../shared/custom-select/custom-select";
import { LanguageService } from '../../../core/services/language-service';
import { LibraryService } from '../../../core/services/library-service';
import { GameService } from '../../../core/services/game-service';

@Component({
  selector: 'app-header',
  imports: [TranslocoPipe, AuthActions, CustomSelect],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {  
  private readonly langService = inject(LanguageService);
  protected readonly gameService = inject(GameService);
  protected readonly libraryService = inject(LibraryService);
  private readonly renderer = inject(Renderer2);

  readonly buttonStyle = signal<string>('button-accent-inverse');
  protected readonly title = signal('Ng-Hangman');

  protected readonly currentLanguage = this.langService.currentLanguage;
  protected readonly languages = this.langService.languages;

  onLanguageSelect(lang: string) {
    this.langService.setLanguage(lang);
    this.updateDirection(lang);
    this.gameService.restartGame();
  }

  private updateDirection(lang: string) {
    const isRtl = ['ar', 'he', 'fa'].includes(lang);
    const direction = isRtl ? 'rtl' : 'ltr';
    this.renderer.setAttribute(document.documentElement, 'dir', direction);
  }
}
