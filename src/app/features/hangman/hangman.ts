import { Component, inject, OnInit, signal } from '@angular/core';
import { HangmanDisplay } from "./hangman-display/hangman-display";
import { Question } from "./question/question";
import { Keyboard } from "./keyboard/keyboard";
import { HangmanService,   } from '../../core/services/hangman-service';
import { GameService } from '../../core/services/game-service';
import { QuizzItem } from '../../core/models/quizz-item.interface';
import { Actions } from "./actions/actions";

@Component({
  selector: 'app-hangman',
  imports: [HangmanDisplay, Question, Keyboard, Actions],
  templateUrl: './hangman.html',
  styleUrl: './hangman.scss',
})
export default class Hangman implements OnInit {
  question = '';
  questions: string[] = [];
  guesses: string[] = [];
  category = '';

  private readonly hangmanService = inject(HangmanService);
  private readonly gameService = inject(GameService);

  protected readonly currentQuizz = signal<QuizzItem | undefined>(undefined);





  ngOnInit(): void {
    


  }
}
