import { Request, Response, NextFunction } from "express";

import { getConnection } from "../../db";
import { IUserInfo } from "../../lib/types";
import { validateIUserInfo } from "../../lib/validate";

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

export const insertPlayer = async (req: Request, res: Response, next: NextFunction) => {
    const body: IUserInfo = req.body;
    const query = `
    INSERT INTO player (name, userid)
    VALUES ($1, $2)
    `;
    const validationRes = await validateIUserInfo(body);
    if (validationRes.code !== 0) {
        console.log(`Code ${validationRes.code}: Invalid query has rejected`)
        res.json(validationRes);
        return next();
    }
    const values = [
        body.name,
        body.userid];
    
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
                code: 1120,
                msg: `InsertPlayer: Error occured while inserting.\n${err}`,
            });
            console.log(`InsertPlayer: Error occured while inserting.\n${err}`);
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