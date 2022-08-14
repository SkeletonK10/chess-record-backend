import { Chess } from "chess.js";

import { GameListEntry } from "./types";

interface IPiece {
  [key: string]: any;
}

export const calculatePenaltyRating = (startpos: string) => {
  const PieceValue: IPiece = {
    'Q': 9,
    'R': 5,
    'K': 4,
    'B': 3,
    'N': 3,
    'P': 1,
    'q': -9,
    'r': -5,
    'k': -4,
    'b': -3,
    'n': -3,
    'p': -1,
  }
  
  const position: string = startpos.split(' ')[0];
  let blackOffset = 0;
  [...position].forEach((c) => {
    if (c in PieceValue)
      blackOffset += PieceValue[c];
  })
  blackOffset *= 100;
  return {
    whiteOffset: blackOffset,
    blackOffset: -blackOffset,
  }
}

export const calculateEloDiff = (white: number, black: number, result: string, whiteK: number = 30, blackK: number = 30) => {
  if (result === '중단됨') {
    return {
      whitediff: 0,
      blackdiff: 0,
    }
  }
  else {
    let resultNum: number;
    if (result === '백 승')
      resultNum = 1;
    else if (result === '무승부')
      resultNum = 0.5;
    else
      resultNum = 0;
    const whiteWR = 1 / ((Math.pow(10, (black - white) / 400)) + 1)
    const blackWR = 1 - whiteWR;
    
    const W = resultNum - whiteWR;
    const whiteDiff = Math.round(whiteK * W);
    const blackDiff = Math.round(blackK * W * -1);
    return {
      whiteDiff: whiteDiff,
      blackDiff: blackDiff,
    };
  }
}

export const calculateSummary = (gameList: Array<GameListEntry>, playerID?: number) => {
  const summary = {
    win: 0,
    draw: 0,
    lose: 0,
    winRate: '0%',
  }
  
  if (!playerID) {
    gameList.map((game: GameListEntry) => {
      if (game.result === '백 승') summary.win++;
      else if (game.result === '무승부') summary.draw++;
      else if (game.result === '흑 승') summary.lose++;
    });
  }
  else {
    gameList.map((game: GameListEntry) => {
      if (
        (game.whiteid === playerID && game.result === '백 승') ||
        (game.blackid === playerID && game.result === '흑 승')
      ) summary.win++;
      else if (
        (game.whiteid === playerID && game.result === '무승부') ||
        (game.blackid === playerID && game.result === '무승부')
      ) summary.draw++;
      else if (
        (game.whiteid === playerID && game.result === '흑 승') ||
        (game.blackid === playerID && game.result === '백 승')
      ) summary.lose++;
    });
  }
  const winRate = ((summary.win + 0.5 * summary.draw) / (summary.win + summary.draw + summary.lose)) * 100;
  summary.winRate = `${winRate.toFixed(2)}%`;
  return summary;
}