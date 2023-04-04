import { Chess } from 'chess.js';

import { getConnection } from '../db';
import { IGameInfo, IUserInfo } from './types';

// POST /game/ Validation
// playedat: formatting, 현재 날짜보다 미래면 에러
// white / black: -1(선택하지 않음)일 때, 혹은 백과 흑이 같은 사람일 때 에러
// result: -1(선택하지 않음)일 때 에러

// POST /user/ Validation
// name: 별 것 없음
// userid: 3~16자 영문 대소문자, 숫자 (정규식), 중복 체크
// TODO
// name: html 태그 조심

export const validateIGameInfo = (data: IGameInfo) => {
  try {
    // playedat
    if (!Date.parse(data.playedat)) {
      return {
        code: 2000,
        msg: "Error: playedat not set",
      };
    }
    const playedAt: Date = new Date(data.playedat);
    playedAt.setHours(9);
    const standardTime = new Date();
    standardTime.setDate(standardTime.getDate() + 1);
    if (playedAt > standardTime) {
      return {
        code: 2001,
        msg: "Error: playedat set to future date",
      };
    }
    
    // player
    if (data.white === "-1" || data.black === "-1") {
      return {
        code: 2002,
        msg: "Error: player not selected",
      }
    }
    if (data.white === data.black) {
      return {
        code: 2003,
        msg: "Error: white player and black player are same",
      };
    }
    
    // startpos
    try {
      new Chess().load(data.startpos);
    } catch {
      return {
        code: 2004,
        msg: "Error: invalid start position",
      };
    }
    
    const rOrig = Number(data.originaltime);
    const rInc = Number(data.incrementtime);
    if (!Number.isInteger(rOrig) || !Number.isInteger(rInc)) {
      return {
        code: 2007,
        msg: "Error: invalid time setting argument"
      }
    }
    
    // result
    if (data.result === "-1") {
      return {
        code: 2005,
        msg: "Error: result not selected",
      };
    }
    if (['백 승', '무승부', '흑 승', '중단됨'].includes(data.result) === false) {
      return {
        code: 2006,
        msg: "Error: invalid result",
      };
    }
    
  } catch (err) {
    return {
      code: 1,
      msg: `Default Error: ${err}`,
    };
  }
  
  return {
    code: 0,
    msg: "This data is valid!",
  };
}

export const validateIUserInfo = async (data: IUserInfo) => {
  try {
    // name
    const namePattern = new RegExp("^[가-힣]{1,6}$");
    if (namePattern.exec(data.name) === null) {
      return {
        code: 2100,
        msg: "Error: Invalid name format",
      };
    }
    
    // userid
    const userIdPattern = new RegExp("^[a-zA-Z0-9]{3,16}$");
    if (userIdPattern.exec(data.userid) === null) {
      return {
        code: 2101,
        msg: "Error: Invalid userid format",
      };
    }
    
    // Duplicate check: DB connection
    let result;
    try {
      const client = await getConnection();
      try {
        const query = `SELECT * FROM player WHERE userid=$1`;
        result = await client.query(query, [data.userid]);
      } catch (err) {
        return {
          code: 1241,
          msg: `Error occured while searching: ${err}`,
        }
      } finally { client.release(); }
    } catch (err) {
      return {
        code: 1001,
        msg: "Error occured while DB connecting.",
      };
    }

    if (result.rowCount !== 0) {
      return {
        code: 2102,
        msg: "input userid is duplicated",
      }
    }
  } catch (err) {
    return {
      code: 1,
      msg: `Default Error: ${err}`,
    };
  }
  
  return {
    code: 0,
    msg: "This data is valid!",
  };
}

export const validateNotation = (startpos: string, notation: string) => {
  const game = new Chess();
  if (!game.loadPgn(notation)) return false;
  const moves = game.history();
  const chess = new Chess();
  chess.load(startpos);
  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    if (chess.move(move) === null) {
      return false;
    }
    return true;
  }
}
