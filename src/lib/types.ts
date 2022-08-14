export interface IGameInfo {
  playedat: string;
  white: string;
  black: string;
  startpos: string;
  originaltime: number;
  incrementtime: number;
  result: string;
  notation?: string;
  description?: string;
};

export interface GameListEntry {
  id: number;
  playedat: string;
  createdat: string;
  white: number;
  black: number;
  result: string;
};

export interface GameList {
  list: Array<GameListEntry>;
  summary: {
    win: number;
    draw: number;
    lose: number;
    winRate: string;
  }
}

export interface IUserInfo {
  name: string;
  userid: string;
}

export interface ResponseInfo {
  code: number;
  msg: string;
}