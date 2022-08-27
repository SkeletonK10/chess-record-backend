import { Request, Response, NextFunction } from "express";

import { getConnection } from "../db";

export const welcome = (req: Request, res: Response, next: NextFunction) => {
    res.send("Hello, world!");
};

export const dbTestAndWelcome = async (req: Request, res: Response, next: NextFunction) => {
    await (await getConnection()).release();
    res.send("Hello, world! DB connection has tested");
};