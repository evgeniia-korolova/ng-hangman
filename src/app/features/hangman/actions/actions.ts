import { Component, inject } from '@angular/core';
import { HangmanService } from '../../../core/services/hangman-service';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-actions',
  imports: [TranslocoPipe],
  templateUrl: './actions.html',
  styleUrl: './actions.scss',
})
export class Actions {
  protected readonly hangmanService = inject(HangmanService);

  onCategoryChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.hangmanService.currentCategory.set(select.value);
  }
}
