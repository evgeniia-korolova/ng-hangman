import { Component, inject, Renderer2 } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { LanguageService } from '../../../core/services/language-service';

@Component({
  selector: 'app-language-switcher',
  imports: [TranslocoPipe],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.scss',
})
export class LanguageSwitcher {
  private readonly langService = inject(LanguageService);
  private readonly renderer = inject(Renderer2);

  protected readonly currentLanguage = this.langService.currentLanguage;
  protected readonly languages = this.langService.languages;

  onLanguageChange(event: Event): void {
    const langCode = (event.target as HTMLSelectElement).value;
    this.langService.setLanguage(langCode);
    this.updateDirection(langCode);
  }

  private updateDirection(lang: string) {
    const isRtl = ['ar', 'he', 'fa'].includes(lang);
    const direction = isRtl ? 'rtl' : 'ltr';
    this.renderer.setAttribute(document.documentElement, 'dir', direction);
  }
}
