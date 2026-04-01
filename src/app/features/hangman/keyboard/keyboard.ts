import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChildren,
} from '@angular/core';
import { KeyboardChar, KeyboardRows } from '../../../core/models/keyboard-char.interface';
import { UpperCasePipe } from '@angular/common';
import { LanguageService } from '../../../core/services/language-service';

@Component({
  selector: 'app-keyboard',
  imports: [UpperCasePipe],
  templateUrl: './keyboard.html',
  styleUrl: './keyboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Keyboard {
  protected readonly langService = inject(LanguageService);
  readonly keyboardChar = input.required<KeyboardChar[]>();
  readonly rows = input.required<KeyboardRows>();

  readonly keyPressed = output<string>();

  readonly focusedRow = signal(0);
  readonly focusedCol = signal(0);

  readonly buttons = viewChildren<ElementRef<HTMLButtonElement>>('keyBtn');

  private syncDomFocus() {
    const row = this.focusedRow();
    const col = this.focusedCol();

    const flatIndex = this.getFlatIndex(row, col);
    const button = this.buttons()?.[flatIndex];

    button?.nativeElement.focus();
  }

  private commitFocus(row: number, col: number) {
    this.focusedRow.set(row);
    this.focusedCol.set(col);

    queueMicrotask(() => this.syncDomFocus());
  }

  private getFlatIndex(row: number, col: number): number {
    let index = 0;

    for (let r = 0; r < row; r++) {
      index += this.rows()[r].length;
    }
    return index + col;
  }

  setFocusAndRestore(row: number, col: number) {
    this.commitFocus(row, col);
  }

  onKeyClick(value: string) {
    this.keyPressed.emit(value);
    this.moveFocusAfterInput();
  }

  private moveFocusAfterInput() {
    const rows = this.rows();

    let r = this.focusedRow();
    let c = this.focusedCol();

    const maxSteps = rows.reduce((sum, row) => sum + row.length, 0);

    let steps = 0;

    while (steps < maxSteps) {
      steps++;

      c++;

      if (c >= rows[r].length) {
        r++;
        c = 0;

        if (r >= rows.length) {
          r = 0;
        }
      }

      const key = rows[r]?.[c];

      if (key && !key.disabled) {
        this.commitFocus(r, c);
        return;
      }
    }
  }

  onKeyDown(event: KeyboardEvent, row: number, col: number) {
    const rows = this.rows();

    switch (event.key) {
      case 'ArrowRight': {
        event.preventDefault();
        this.moveRight(row, col, rows);
        break;
      }

      case 'ArrowLeft': {
        event.preventDefault();
        this.moveLeft(row, col, rows);
        break;
      }

      case 'ArrowDown': {
        event.preventDefault();
        this.moveDown(row, col, rows);
        break;
      }

      case 'ArrowUp': {
        event.preventDefault();
        this.moveUp(row, col, rows);
        break;
      }

      case 'Enter':
      case ' ': {
        event.preventDefault();
        const key = rows[row]?.[col];

        if (key && !key.disabled) {
          this.onKeyClick(key.value);
        }
        return;
      }
    }
  }

  moveRight(row: number, col: number, rows: KeyboardRows) {
    for (let c = col + 1; c < rows[row].length; c++) {
      const key = rows[row][c];

      if (key && !key.disabled) {
        this.commitFocus(row, c);
        return;
      }
    }
  }

  moveLeft(row: number, col: number, rows: KeyboardRows) {
    for (let c = col - 1; c >= 0; c--) {
      const key = rows[row][c];

      if (key && !key.disabled) {
        this.commitFocus(row, c);
        return;
      }
    }
  }

  moveDown(row: number, col: number, rows: KeyboardRows) {
    for (let r = row + 1; r < rows.length; r++) {
      const rowData = rows[r];

      if (rowData[col] && !rowData[col].disabled) {
        this.commitFocus(r, col);
        return;
      }

      for (let offset = 1; offset < rowData.length; offset++) {
        const right = col + offset;
        const left = col - offset;

        if (rowData[right] && !rowData[right].disabled) {
          this.commitFocus(r, right);
          return;
        }

        if (rowData[left] && !rowData[left].disabled) {
          this.commitFocus(r, left);
          return;
        }
      }
    }
  }

  moveUp(row: number, col: number, rows: KeyboardRows) {
    for (let r = row - 1; r >= 0; r--) {
      const rowData = rows[r];

      if (rowData[col] && !rowData[col].disabled) {
        this.commitFocus(r, col);
        return;
      }

      for (let offset = 1; offset < rowData.length; offset++) {
        const right = col + offset;
        const left = col - offset;

        if (rowData[right] && !rowData[right].disabled) {
          this.commitFocus(r, right);
          return;
        }

        if (rowData[left] && !rowData[left].disabled) {
          this.commitFocus(r, left);
          return;
        }
      }
    }
  }
}
