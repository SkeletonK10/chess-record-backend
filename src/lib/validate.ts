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

export const validateIGameInfo = (data: IGameInfo) => {
  try {
    // playedat
    if (Date.parse(data.playedat) === NaN) {
      return {
        code: 2000,
        msg: "Error: playedat not set",
      };
    }
    const playedAt: Date = new Date(data.playedat);
    playedAt.setHours(9);
    if (playedAt > new Date()) {
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
    if (new Chess().load(data.startpos) === false) {
      return {
        code: 2004,
        msg: "Error: invalid start position",
      };
    }
    
    // result
    if (data.result === "-1") {
      return {
        code: 2005,
        msg: "Error: result not selected",
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
    const client = await getConnection();
    try {
      const query = `SELECT * FROM player WHERE userid=$1`;
      result = await client.query(query, [data.userid]);
    } catch (err) {
      return {
        code: 1101,
        msg: `Error occured while searching: ${err}`,
      }
    } finally { client.end(); }
    
    if (!result) throw new Error();
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