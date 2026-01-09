import { Component, inject } from '@angular/core';
import { HangmanDisplay } from "./hangman-display/hangman-display";
import { Question } from "./question/question";
import { Keyboard } from "./keyboard/keyboard";
import { HangmanService } from './services/hangman-service';

@Component({
  selector: 'app-hangman',
  imports: [HangmanDisplay, Question, Keyboard],
  templateUrl: './hangman.html',
  styleUrl: './hangman.scss',
})
export default class Hangman {
  question = '';
  questions: string[] = [];
  guesses: string[] = [];
  category = '';

  private readonly hangmanService = inject(HangmanService);
}
