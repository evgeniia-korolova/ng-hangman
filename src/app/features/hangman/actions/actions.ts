import { Component, inject } from '@angular/core';
import { HangmanService } from '../../../core/services/hangman-service';
import { AuthService } from '../../../core/services/auth-service';
import { CustomSelect } from "../../../shared/custom-select/custom-select";

@Component({
  selector: 'app-actions',
  imports: [CustomSelect],
  templateUrl: './actions.html',
  styleUrl: './actions.scss',
})
export class Actions {
  protected readonly hangmanService = inject(HangmanService);
  protected readonly authService = inject(AuthService);
  
  onCategoryChange(categoryKey: string) {
    this.hangmanService.currentCategory.set(categoryKey);
  }
}
