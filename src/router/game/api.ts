import { Chess } from "chess.js";
import { Request, Response, NextFunction } from "express";

import { getConnection, getConnectionPool } from "../../db";
import { calculateEloDiff, calculatePenaltyRating, moveQuery } from "../../lib/chess";
import { IGameInfo, ModifiableIGameInfo } from "../../lib/types";
import { validateIGameInfo, validateNotation } from "../../lib/validate";

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
            startpos,
            originaltime,
            incrementtime,
            whiterating,
            blackrating,
            result,
            whiteratingdiff,
            blackratingdiff,
            notation,
            description
    FROM game
    WHERE id=$1
    `;
    
    const playerQuery = `
    SELECT id, userid, name
    FROM player
    WHERE id=$1
    `;
    
    try {
        const pool = await getConnectionPool();
        try {
            const gameRows = await pool.query(gameQuery, [req.params.id]);
            const game = gameRows.rows[0];
            const whiteRows = await pool.query(playerQuery, [game.white]);
            const blackRows = await pool.query(playerQuery, [game.black]);
            game.white = {
                ...whiteRows.rows[0],
                rating: game.whiterating,
            };
            game.black = {
                ...blackRows.rows[0],
                rating: game.blackrating,
            };
            res.json(game);
        } catch (err) {
            res.json({
                code: 1210,
                msg: `GameView: Error occured while searching.\n${err}`,
            });
            console.log(`GameView: Error occured while searching.\n${err}`);
        } finally {
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

// TODO 1: 필드 추가 (타임컨트롤, 레이팅변화)
// TODO 2: 레이팅 반영 (페널티 등등 고려해서)

export const insertGame = async (req: Request, res: Response, next: NextFunction) => {
    console.time("InsertGame");
    const body: IGameInfo = req.body;
    const playerQuery = `SELECT rating FROM player WHERE id=$1`;
    const playerUpdateQuery = `
    UPDATE player
    SET rating=$1
    WHERE id=$2
    `;
    const gameQuery = `
    INSERT INTO game (
        id,
        playedat,
        white,
        black,
        startpos,
        originaltime,
        incrementtime,
        whiterating,
        blackrating,
        result,
        whiteratingdiff,
        blackratingdiff,
        notation,
        description) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    `;
    const validationRes = validateIGameInfo(body);
    if (validationRes.code !== 0) {
        console.log(`Code ${validationRes.code}: Invalid query has rejected`);
        console.timeEnd("InsertGame");
        res.json(validationRes);
        return next();
    }
    
    try {
        const pool = await getConnectionPool();
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            const whiteRetP = pool.query(playerQuery, [body.white]);
            const blackRetP = pool.query(playerQuery, [body.black]);
            const idRetP = pool.query(`SELECT NEXTVAL('game_id_seq')`);
            const [whiteRet, blackRet, idRet] = await Promise.all([whiteRetP, blackRetP, idRetP]);
            const id = idRet.rows[0].nextval;
            const whiteRating = whiteRet.rows[0].rating;
            const blackRating = blackRet.rows[0].rating;
            const { whiteOffset, blackOffset } = calculatePenaltyRating(body.startpos);
            const { whiteDiff, blackDiff } = calculateEloDiff(whiteRating + whiteOffset, blackRating + blackOffset, body.result);
            const gameValues = [
                id,
                body.playedat,
                body.white,
                body.black,
                body.startpos,
                body.originaltime,
                body.incrementtime,
                whiteRating,
                blackRating,
                body.result,
                whiteDiff,
                blackDiff,
                body.notation,
                body.description];
            const gameRet = await client.query(gameQuery, gameValues);
            const whiteUpdate = await client.query(playerUpdateQuery, [whiteRating + whiteDiff, body.white]);
            const blackUpdate = await client.query(playerUpdateQuery, [blackRating + blackDiff, body.black]);
            const chess = new Chess();
            chess.load(body.startpos);
            if (body.notation && validateNotation(body.startpos, body.notation)) {
                await moveQuery(client, id, body.startpos, body.notation);
            }
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
            client.release();
            console.timeEnd("InsertGame");
            return next();
        }
    } catch (err) {
        res.json({
            code: 1001,
            msg: "Error occured while DB connecting.",
        });
        console.log("Error occured while DB connecting.");
        console.timeEnd("InsertGame");
        return next();
    }
};

export const modifyGame = async (req: Request, res: Response, next: NextFunction) => {
    const body: ModifiableIGameInfo = req.body;
    const query = `
    UPDATE game SET
        notation=$1,
        description=$2
    WHERE id=$3
    ;`;
    
    if (!Number.isInteger(Number(req.params.id))) {
        res.json({
            code: 2901,
            msg: `Error: Invalid id for update.`,
        });
        console.log(`Error: Invalid id for update.`);
        return next();
    }
    try {
        const client = await getConnection();
        try {
            await client.query("BEGIN");
            const gameValues = [
                body.notation,
                body.description,
                req.params.id];
            const gameRet = await client.query(query, gameValues);
            await client.query("COMMIT");
            res.json({
                code: 0,
                msg: "Update query executed successfully!",
            });
            console.log("Update query executed successfully!");
        } catch (err) {
            await client.query("ROLLBACK");
            res.json({
                code: 1310,
                msg: `UpdateGame: Error occured while updating.\n${err}`,
            });
            console.log(`UpdateGame: Error occured while updating.\n${err}`);
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