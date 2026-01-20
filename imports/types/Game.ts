export interface Game {
  _id?: string;
  board: (string | null)[];
  currentPlayer: 'X' | 'O';
  status: 'waiting' | 'playing' | 'finished';
  winner?: 'X' | 'O' | 'draw';
  createdBy?: string;
  createdAt?: Date;
}