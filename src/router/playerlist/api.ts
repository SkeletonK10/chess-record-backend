import { Request, Response, NextFunction } from "express";

import { getConnection } from "../../db";

export const test = (req: Request, res: Response, next: NextFunction) => {
    res.send("Hello, world!");
};

export const getPlayerList = async (req: Request, res: Response, next: NextFunction) => {
    const query = `
    SELECT id, name, rating
    FROM player
    `;
    const client = await getConnection();
    const result = await client.query(query);
    client.end();
    const rows = result.rows;
    res.json(rows);
    return next();
}
