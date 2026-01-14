import { inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly translocoService = inject(TranslocoService);

  readonly currentLanguage = signal<string>('en');
  readonly languages = signal<string[]>([]);
  readonly activeLang = toSignal(this.translocoService.langChanges$, {
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

  setLanguage(lang: string) {
    this.translocoService.setActiveLang(lang);
    this.currentLanguage.set(lang);
  }
}
