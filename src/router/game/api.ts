import { Request, Response, NextFunction } from "express";

export const test = (req: Request, res: Response, next: NextFunction) => {
    res.send("Hello, world!");
};

export const insertGame = (req: Request, res: Response, next: NextFunction) => {
    // TODO: insert game to DB
    
};