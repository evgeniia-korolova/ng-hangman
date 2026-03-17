import { computed, inject, Injectable, signal } from '@angular/core';
import { GameService } from './game-service';

import { UserAuth } from '../models/user-auth.model';
import { saveUser } from './storage.helper';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly gameService = inject(GameService);

  readonly isOverlayOpen = signal(false);
  activeForm = signal<'signUp' | 'signIn' | null>(null);
  readonly currentUser = signal<UserAuth | null>(null);

  constructor() {
    const raw = localStorage.getItem('hangman-user');
    if (raw) {
      const user: UserAuth = JSON.parse(raw);
      this.currentUser.set(user);
    }
  }

  readonly isRegistered = computed(() => !!this.currentUser()?.isRegistered);
  readonly isAuthenticated = computed(() => !!this.currentUser()?.isAuthenticated);

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

  async createUser(name: string, email: string, password: string): Promise<UserAuth> {
    const hashedPassword = await this.hashPassword(password);

    const stats =
      this.gameService.gamesNumber() > -1
        ? {
            games: this.gameService.gamesNumber(),
            wins: this.gameService.wins?.() ?? 0,
            losses: this.gameService.losses?.() ?? 0,
          }
        : { games: 0, wins: 0, losses: 0 };

    const user: UserAuth = {
      id: crypto.randomUUID(),
      name,
      password: hashedPassword,
      email,
      avatar: name.charAt(0).toUpperCase(),
      stats,
      isRegistered: true,
      isAuthenticated: false,
    };

    localStorage.setItem('hangman-user', JSON.stringify(user));
    this.currentUser.set(user);
    return user;
  }

  async loginUser(email: string, password: string): Promise<boolean> {
    const raw = localStorage.getItem('hangman-user');
    if (!raw) return false;

    const user: UserAuth = JSON.parse(raw);
    const hashedPassword = await this.hashPassword(password);

    if (user.email === email && user.password === hashedPassword) {
      user.isAuthenticated = true;
      localStorage.setItem('hangman-user', JSON.stringify(user));
      this.currentUser.set(user);
      return true;
    }

    return false;
  }

  updateStats(games: number, wins: number, losses: number): void {
    const user = this.currentUser();
    if (!user) return;

    user.stats = { games, wins, losses };
    // localStorage.setItem('hangman-user', JSON.stringify(user));
    saveUser(user);
    this.currentUser.set(user);
  }

  async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    const hashArray = [...new Uint8Array(hashBuffer)];
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }
}
