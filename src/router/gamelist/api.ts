import { Request, Response, NextFunction } from "express";
import { RowDescriptionMessage } from "pg-protocol/dist/messages";

import { getConnection } from "../../db";
import { calculateSummary } from "../../lib/chess";

import { GameListEntry } from "../../lib/types";

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
            W.id as whiteid,
            B.id as blackid,
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
            const rows: Array<GameListEntry> = result.rows;
            const summary = calculateSummary(rows, playerID);
            const response = {
                list: rows,
                summary: summary,
            }
            res.json(response);
        } catch (err) {
            res.json({
                code: 1220,
                msg: `GameList: Error occured while searching.\n${err}`,
            });
            console.log(`GameList: Error occured while searching.\n${err}`);
        } finally {
            client.release();
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
