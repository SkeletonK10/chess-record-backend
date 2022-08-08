import { Request, Response, NextFunction } from "express";
import { getConnection } from "../../db";

export const test = (req: Request, res: Response, next: NextFunction) => {
    res.send("Hello, world!");
};

export const getGameList = async (req: Request, res: Response, next: NextFunction) => {
    
    // Production Code ///////////////////////
    const playerID: number | undefined =
        Number.isInteger(Number(req.query.playerid)) ?
        Number(req.query.playerid) :
        undefined;
    
    const idQuery = playerID ? `WHERE G.white=${playerID} OR G.black=${playerID}` : ``;
    const query = `
    SELECT  G.id as id,
            TO_CHAR(G.createdat, 'YYYY-MM-DD') as createdat,
            TO_CHAR(G.playedat, 'YYYY-MM-DD') as playedat,
            W.name as white,
            B.name as black,
            G.result as result
    FROM    game as G
            JOIN
            player as W ON G.white = W.id
            JOIN
            player as B ON G.black = B.id
    ${idQuery}
    ORDER BY id DESC
    `;
    
    try {
        const client = await getConnection();
        try {
            const result = await client.query(query);
            const rows = result.rows;
            res.json(rows);
        } catch (err) {
            res.json({
                code: 1220,
                msg: `GameList: Error occured while searching.\n${err}`,
            });
            console.log(`GameList: Error occured while searching.\n${err}`);
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
};
