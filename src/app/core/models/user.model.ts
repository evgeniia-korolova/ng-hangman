export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  password: string;
  stats: {
    games: number;
    wins: number;
    losses: number;
  };
}
