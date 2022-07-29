import { Request, Response, NextFunction } from "express";

import { getConnection } from "../../db";

export const test = (req: Request, res: Response, next: NextFunction) => {
    res.send("Hello, world!");
};

export const getPlayerView = async (req: Request, res: Response, next: NextFunction) => {
    
    const rid: number = Number(req.params.id);
    const id: number = Number.isInteger(rid) ? rid : 1;
    const query = `
    SELECT id, name, rating
    FROM player
    WHERE id = ${id};
    `;
    
    try {
        const client = await getConnection();
        try {
            const result = await client.query(query);
            const row = result.rows[0];
            res.json(row);
        } catch (err) {
            res.json({
                code: 1230,
                msg: `PlayerView: Error occured while searching.\n${err}`,
            });
            console.log(`PlayerView: Error occured while searching.\n${err}`);
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
