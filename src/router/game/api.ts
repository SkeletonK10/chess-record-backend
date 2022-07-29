import { Request, Response, NextFunction } from "express";

import { getConnection } from "../../db";
import { IGameInfo, ResponseInfo } from "../../lib/types";

export const test = (req: Request, res: Response, next: NextFunction) => {
    res.send("Hello, world!");
};

export const getGameView = async (req: Request, res: Response, next: NextFunction) => {
    const gameQuery = `
    SELECT  id,
            TO_CHAR(createdAt, 'YYYY-MM-DD') as createdAt,
            TO_CHAR(playedAt, 'YYYY-MM-DD') as playedAt,
            white,
            black,
            result,
            notation,
            description
    FROM game
    WHERE id=$1
    `;
    
    const playerQuery = `
    SELECT  id,
            name,
            rating
    FROM player
    WHERE id=$1
    `;
    const client = await getConnection();
    try {
        const gameRows = await client.query(gameQuery, [req.params.id]);
        let game = gameRows.rows[0];
        const whiteRows = await client.query(playerQuery, [game.white]);
        const blackRows = await client.query(playerQuery, [game.black]);
        game.white = whiteRows.rows[0];
        game.black = blackRows.rows[0];
        res.json(game);
    }
    catch (err) {
        console.log("Error occured while fetching data");
        res.json({
            error: err,
        });
    } finally {
        client.end();
        return next();
    }
};

export const insertGame = async (req: Request, res: Response, next: NextFunction) => {
    const body: IGameInfo = req.body;
    const query = `
    INSERT INTO game (playedat, white, black, startpos, result, notation, description) 
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    const values = [
        body.playedat,
        body.white,
        body.black,
        body.startpos,
        body.result,
        body.notation,
        body.description];
    const client = await getConnection();
    try {
        await client.query("BEGIN");
        const ret = await client.query(query, values);
        await client.query("COMMIT");
        console.log("Insert query executed successfully!");
        res.json(ret);
    }
    catch (err) {
        await client.query("ROLLBACK");
        const errResponse: ResponseInfo = {
            code: 1001,
            msg: `Error occured while inserting: ${err}`,
        }
        console.log(errResponse);
        res.json(errResponse);
    } finally {
        client.end();
        return next();
    }
    ///////////////////////////////////////////
};