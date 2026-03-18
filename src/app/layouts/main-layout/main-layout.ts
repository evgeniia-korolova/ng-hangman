import { Component } from '@angular/core';
import { Header } from './header/header';

import Hangman from "../../features/hangman/hangman";
import { Footer } from './footer/footer';

@Component({
  selector: 'app-main-layout',
  imports: [Header, Hangman, Footer],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {}
