import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-question',
  imports: [TranslocoPipe],
  templateUrl: './question.html',
  styleUrl: './question.scss',
})
export class Question {

}
