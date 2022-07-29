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

export interface IUserInfo {
  name: string;
  userid: string;
}

export interface ResponseInfo {
  code: number;
  msg: string;
}