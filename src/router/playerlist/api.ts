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
    try {
        const client = await getConnection();
        try {
            const result = await client.query(query);
            const rows = result.rows;
            res.json(rows);
        } catch (err) {
            res.json({
                code: 1240,
                msg: `PlayerList: Error occured while searching.\n${err}`,
            });
            console.log(`PlayerList: Error occured while searching.\n${err}`);
        } finally {
            client.end();
            return next();
        }
    } catch (err) {
        res.json({
            code: 1001,
            msg: "Error occured while DB connecting.",
        });
        console.log("Error occured while DB connecting.");
        return next();
    }
    
}
