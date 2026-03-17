import { computed, inject, Injectable, signal } from '@angular/core';
import { GameService } from './game-service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly gameService = inject(GameService);

  isRegistered = signal(false);
  isAuthenticated = signal(false);

  readonly isOverlayOpen = signal(false);
  activeForm = signal<'signUp' | 'signIn' | null>(null);
  readonly currentUser = signal<User | null>(null);

  constructor() {
    const raw = localStorage.getItem('hangman-user');
    if (raw) {
      const user: User = JSON.parse(raw);
      this.currentUser.set(user);
      this.isRegistered.set(true);
    }
  }

  openSignUp() {
    this.isOverlayOpen.set(true);
    this.activeForm.set('signUp');
  }

  openSignIn() {
    this.isOverlayOpen.set(true);
    this.activeForm.set('signIn');
  }

  closeOverlay() {
    this.isOverlayOpen.set(false);
    this.activeForm.set(null);
  }

  async createUser(name: string, email: string, password: string): Promise<User> {
    const hashedPassword = await this.hashPassword(password);

    const stats =
      this.gameService.gamesNumber() > -1
        ? {
            games: this.gameService.gamesNumber(),
            wins: this.gameService.wins?.() ?? 0,
            losses: this.gameService.losses?.() ?? 0,
          }
        : { games: 0, wins: 0, losses: 0 };

    const user: User = {
      id: crypto.randomUUID(),
      name,
      password: hashedPassword,
      email,
      avatar: name.charAt(0).toUpperCase(),
      stats,
    };

    localStorage.setItem('hangman-user', JSON.stringify(user));
    this.isRegistered.set(true);
    this.currentUser.set(user);
    return user;
  }

  async loginUser(email: string, password: string): Promise<boolean> {
    const raw = localStorage.getItem('hangman-user');
    if (!raw) return false;

    const user: User = JSON.parse(raw);
    const hashedPassword = await this.hashPassword(password);

    if (user.email === email && user.password === hashedPassword) {
      this.currentUser.set(user);
      this.isAuthenticated.set(true);
      return true;
    }

    return false;
  }

  async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    // digest возвращает Promise<ArrayBuffer>, поэтому нужен await
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }
}
