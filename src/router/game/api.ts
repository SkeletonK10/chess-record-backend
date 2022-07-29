import { Request, Response, NextFunction } from "express";

import { getConnection } from "../../db";
import { IGameInfo, ResponseInfo } from "../../lib/types";
import { validateIGameInfo } from "../../lib/validate";

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
    
    try {
        const client = await getConnection();
        try {
            const gameRows = await client.query(gameQuery, [req.params.id]);
            let game = gameRows.rows[0];
            const whiteRows = await client.query(playerQuery, [game.white]);
            const blackRows = await client.query(playerQuery, [game.black]);
            game.white = whiteRows.rows[0];
            game.black = blackRows.rows[0];
            res.json(game);
        } catch (err) {
            res.json({
                code: 1210,
                msg: `GameView: Error occured while searching.\n${err}`,
            });
            console.log(`GameView: Error occured while searching.\n${err}`);
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

export const insertGame = async (req: Request, res: Response, next: NextFunction) => {
    const body: IGameInfo = req.body;
    const query = `
    INSERT INTO game (playedat, white, black, startpos, result, notation, description) 
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    const validationRes = validateIGameInfo(body);
    if (validationRes.code !== 0) {
        console.log(`Code ${validationRes.code}: Invalid query has rejected`)
        res.json(validationRes);
        return next();
    }
    const values = [
        body.playedat,
        body.white,
        body.black,
        body.startpos,
        body.result,
        body.notation,
        body.description];
    
    try {
        const client = await getConnection();
        try {
            await client.query("BEGIN");
            const ret = await client.query(query, values);
            await client.query("COMMIT");
            res.json({
                code: 0,
                msg: "Insert query executed successfully!",
            });
            console.log("Insert query executed successfully!");
        } catch (err) {
            await client.query("ROLLBACK");
            res.json({
                code: 1110,
                msg: `InsertGame: Error occured while inserting.\n${err}`,
            });
            console.log(`InsertGame: Error occured while inserting.\n${err}`);
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