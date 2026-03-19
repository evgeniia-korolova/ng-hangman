import { GameStats } from '../models/game-stats.model';
import { UserAuth } from '../models/user-auth.model';

export function loadUser(): UserAuth | null {
  const raw = localStorage.getItem('hangman-user');
  return raw ? JSON.parse(raw) : null;
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

export function updateUser(userOrPartial: UserAuth | Partial<UserAuth>): UserAuth | null {
  const raw = localStorage.getItem('hangman-user');

  if ('id' in userOrPartial) {
    localStorage.setItem('hangman-user', JSON.stringify(userOrPartial));
    return userOrPartial as UserAuth;
  }

  if (!raw) return null;

  const user: UserAuth = JSON.parse(raw);
  const updatedUser: UserAuth = {
    ...user,
    ...userOrPartial,
    stats: userOrPartial.stats ?? user.stats,
  };

  localStorage.setItem('hangman-user', JSON.stringify(updatedUser));
  return updatedUser;
}
