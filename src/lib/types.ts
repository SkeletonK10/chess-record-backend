export interface IGameInfo {
  playedat?: string;
  white: string;
  black: string;
  result: string;
  notation?: string;
  description?: string;
};

export interface IUserInfo {
  name: string;
  userid: string;
}

export interface ErrorInfo {
  errorCode: number;
  errorMsg: string;
}