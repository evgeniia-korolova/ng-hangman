import { Component } from '@angular/core';

@Component({
  selector: 'app-hangman-display',
  imports: [],
  templateUrl: './hangman-display.html',
  styleUrl: './hangman-display.scss',
})
export class HangmanDisplay {
  mistakesRemaining = 7;
  success = false;
}
