import { computed, Injectable, signal } from '@angular/core';
import { UserAuth } from '../models/user-auth.model';
import { loadUser, updateUser } from './storage.helper';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly isOverlayOpen = signal(false);
  activeForm = signal<'signUp' | 'signIn' | null>(null);
  readonly currentUser = signal<UserAuth | null>(null);

  constructor() {
    this.initUser();
  }

  readonly isRegistered = computed(() => !!this.currentUser()?.isRegistered);
  readonly isAuthenticated = computed(() => !!this.currentUser()?.isAuthenticated);

  initUser(): void {
    const user = loadUser();
    if (user) {
      this.currentUser.set(user);
    } else {
      const guest: UserAuth = {
        id: crypto.randomUUID(),
        name: 'Guest',
        email: '',
        avatar: 'G',
        password: '',
        stats: { games: 0, wins: 0, losses: 0 },
        isRegistered: false,
        isAuthenticated: false,
      };
      updateUser(guest);
      this.currentUser.set(guest);
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

  async createUser(name: string, email: string, password: string): Promise<UserAuth | null> {
    const hashedPassword = await this.hashPassword(password);
    
    const guest = loadUser();
    const stats = guest?.stats ?? { games: 0, wins: 0, losses: 0 };

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

    const newUser = updateUser(user);

    if (newUser) {
      this.currentUser.set(newUser);
    }

    return newUser;
  }

  async loginUser(email: string, password: string): Promise<boolean> {
    const user = loadUser();
    if (!user) return false;

    const hashedPassword = await this.hashPassword(password);

    if (user.email === email && user.password === hashedPassword) {
      const updatedUser = updateUser({ isAuthenticated: true });
      if (updatedUser) this.currentUser.set(updatedUser);
      return true;
    }

    return false;
  }

  updateStats(games: number, wins: number, losses: number): void {
    const user = this.currentUser();
    if (!user) return;
    const updatedUser = updateUser({ stats: { games, wins, losses } });
    if (updatedUser) this.currentUser.set(updatedUser);
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
