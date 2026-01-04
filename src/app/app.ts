import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Hangman } from "./hangman/hangman";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Hangman],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ng-hangman');
}
