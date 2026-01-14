import { Component, input, output } from '@angular/core';
import { KeyboardChar } from '../../../core/models/keyboard-char.interface';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-keyboard',
  imports: [UpperCasePipe],
  templateUrl: './keyboard.html',
  styleUrl: './keyboard.scss',
})
export class Keyboard {
  readonly keyboardChar = input.required<KeyboardChar[]>();

  keyPressed = output<string>();

  onKeyClick(value: string) {
    this.keyPressed.emit(value);
  }
}
