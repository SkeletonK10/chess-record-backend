import { Request, Response, NextFunction } from "express";

import { getConnection } from "../../db";
import { calculateEloDiff, calculatePenaltyRating } from "../../lib/chess";
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
    SELECT name
    FROM player
    WHERE id=$1
    `;
    
    try {
        const client = await getConnection();
        try {
            const gameRows = await client.query(gameQuery, [req.params.id]);
            const game = gameRows.rows[0];
            const whiteRows = await client.query(playerQuery, [game.white]);
            const blackRows = await client.query(playerQuery, [game.black]);
            game.white = {
                name: whiteRows.rows[0].name,
                rating: game.whiterating,
                ratingdiff: game.whiteratingdiff,
            };
            game.black = {
                name: blackRows.rows[0].name,
                rating: game.blackrating,
                ratingdiff: game.blackratingdiff,
            };
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

// TODO 1: 필드 추가 (타임컨트롤, 레이팅변화)
// TODO 2: 레이팅 반영 (페널티 등등 고려해서)

export const insertGame = async (req: Request, res: Response, next: NextFunction) => {
    const body: IGameInfo = req.body;
    const playerQuery = `SELECT rating FROM player WHERE id=$1`;
    const playerUpdateQuery = `
    UPDATE player
    SET rating=$1
    WHERE id=$2
    `;
    const gameQuery = `
    INSERT INTO game (
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
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    `;
    const validationRes = validateIGameInfo(body);
    if (validationRes.code !== 0) {
        console.log(`Code ${validationRes.code}: Invalid query has rejected`)
        res.json(validationRes);
        return next();
    }
    
    try {
        const client = await getConnection();
        try {
            await client.query("BEGIN");
            const whiteRet = await client.query(playerQuery, [body.white]);
            const blackRet = await client.query(playerQuery, [body.black]);
            const whiteRating = whiteRet.rows[0].rating;
            const blackRating = blackRet.rows[0].rating;
            const { whiteOffset, blackOffset } = calculatePenaltyRating(body.startpos);
            const { whiteDiff, blackDiff } = calculateEloDiff(whiteRating + whiteOffset, blackRating + blackOffset, body.result);
            const gameValues = [
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