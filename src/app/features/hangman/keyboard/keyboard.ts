import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { KeyboardChar, KeyboardRows } from '../../../core/models/keyboard-char.interface';
import { UpperCasePipe } from '@angular/common';
import { LanguageService } from '../../../core/services/language-service';

@Component({
  selector: 'app-keyboard',
  imports: [UpperCasePipe],
  templateUrl: './keyboard.html',
  styleUrl: './keyboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Keyboard {
  protected readonly langService = inject(LanguageService)
  readonly keyboardChar = input.required<KeyboardChar[]>();
  readonly rows = input.required<KeyboardRows>();

  readonly keyPressed = output<string>();

  onKeyClick(value: string) {
    this.keyPressed.emit(value);
    console.log(value);    
  }
}
