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
    try {
        const result = await client.query(query);
        await client.end();
        const rows = result.rows;
        res.json(rows);
        return next();
    } catch (err) {
        await client.end();
        return next();
    }
    
}

export const getPlayer = async (req: Request, res: Response, next: NextFunction) => {
    
    const rid: number = Number(req.params.id);
    const id: number = Number.isInteger(rid) ? rid : 1;
    const query = `
    SELECT id, name, rating
    FROM player
    WHERE id = ${id};
    `;
    const client = await getConnection();
    const result = await client.query(query);
    const rows = result.rows[0];
    res.json(rows);
    return next();
}
