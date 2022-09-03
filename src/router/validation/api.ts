import { Request, Response, NextFunction } from "express";

import { validateNotation } from "../../lib/validate";

export const validateNotationAPI = (req: Request, res: Response, next: NextFunction) => {
  const startpos = String(req.query.startpos) || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  const notation = String(req.query.notation) || '';
  if (validateNotation(startpos, notation)) {
    res.json({
      code: 0,
      msg: "Requested notation is valid!",
    });
  } else {
    res.json({
      code: 2200,
      msg: "Requested notation is invalid!",
    });
  }
  return next();
};
