import { GameStats } from '../models/game-stats.model';
import { UserAuth } from '../models/user-auth.model';

export function saveUser(user: UserAuth): void {
  localStorage.setItem('hangman-user', JSON.stringify(user));
}

export function loadUser(): UserAuth | null {
  const raw = localStorage.getItem('hangman-user');
  return raw ? JSON.parse(raw) : null;
}

export function saveStats(stats: GameStats): void {
  const raw = localStorage.getItem('hangman-user');
  if (!raw) return;

  const user: UserAuth = JSON.parse(raw);
  user.stats = stats;
  localStorage.setItem('hangman-user', JSON.stringify(user));
}

export function loadStats(): GameStats {
  const raw = localStorage.getItem('hangman-user');
  if (!raw) {
    return { games: 0, wins: 0, losses: 0 };
  }

  try {
    const user: UserAuth = JSON.parse(raw);
    return user.stats ?? { games: 0, wins: 0, losses: 0 };
  } catch {
    return { games: 0, wins: 0, losses: 0 };
  }
}
