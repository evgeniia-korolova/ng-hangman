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
  readonly currentUser = signal<User | null>(null)

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

  createUser(name: string, email: string): User {
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
      email,
      avatar: name.charAt(0).toUpperCase(),
      stats,
    };

    localStorage.setItem('user', JSON.stringify(user));
    this.isRegistered.set(true);
    this.currentUser.set(user);
    return user;
  }
}
