import { Component, inject, viewChild } from '@angular/core';
import { AuthService } from '../../../core/services/auth-service';
import { CustomSelect } from '../../../shared/custom-select/custom-select';
import { LibraryService } from '../../../core/services/library-service';
import { GameService } from '../../../core/services/game-service';

@Component({
  selector: 'app-actions',
  imports: [CustomSelect],
  templateUrl: './actions.html',
  styleUrl: './actions.scss',
})
export class Actions {
  protected readonly gameService = inject(GameService);
  protected readonly libraryService = inject(LibraryService);
  protected readonly authService = inject(AuthService);

  readonly categorySelectButton = viewChild<CustomSelect>('categorySelect');

  onCategoryChange(categoryKey: string) {
    this.gameService.currentCategory.set(categoryKey);
    this.gameService.restartGame();
  }
}
