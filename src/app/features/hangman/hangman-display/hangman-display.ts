import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-hangman-display',
  imports: [TranslocoPipe],
  templateUrl: './hangman-display.html',
  styleUrl: './hangman-display.scss',
})
export class HangmanDisplay {
  mistakesRemaining = 7;
  success = false;
}
