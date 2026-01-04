import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';

const defaultPath = 'data/data/general'

@Injectable({
  providedIn: 'root',
})
export class HangmanService {
  questions = httpResource(() => 'defaultPath')
}
