import { Component, inject, Renderer2, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-language-switcher',
  imports: [TranslocoPipe],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.scss',
})
export class LanguageSwitcher {
  private readonly translocoService = inject(TranslocoService);
  private readonly renderer = inject(Renderer2);

  protected readonly currentLanguage = signal<string>('en');
  protected readonly languages = signal<string[]>([]);

  protected readonly activeLang = toSignal(this.translocoService.langChanges$, {
    initialValue: this.translocoService.getActiveLang(),
  });

  constructor() {
    this.currentLanguage.set(this.translocoService.getActiveLang());

    const availableLangs = this.translocoService.getAvailableLangs();

    if (Array.isArray(availableLangs) && typeof availableLangs[0] === 'string') {
      this.languages.set(availableLangs as string[]);
    } else {
      this.languages.set(
        (availableLangs as { id: string; label: string }[]).map((lang) => lang.id),
      );
    }
  }

  

  changeLanguage(lang: string) {
    this.translocoService.setActiveLang(lang);
    this.currentLanguage.set(lang);
  }

  onLanguageChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const langCode = target.value;

    this.translocoService.setActiveLang(langCode);
    this.currentLanguage.set(langCode);

    this.updateDirection(langCode);
  }

  updateDirection(lang: string) {
    const isRtl = ['ar', 'he', 'fa'].includes(lang);
    const direction = isRtl ? 'rtl' : 'ltr';

    this.renderer.setAttribute(document.documentElement, 'dir', direction);
  }
}
