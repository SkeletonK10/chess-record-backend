import { Request, Response, NextFunction } from "express";

import { getConnection } from "../../db";

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
    WHERE id=${req.params.id}
    `;
    
    const playerQuery = (pid: number) => `
    SELECT  id,
            name,
            rating
    FROM player
    WHERE id=${pid}
    `;
    const client = await getConnection();
    try {
        const gameRows = await client.query(gameQuery);
        let game = gameRows.rows[0];
        const whiteRows = await client.query(playerQuery(game.white));
        const blackRows = await client.query(playerQuery(game.black));
        game.white = whiteRows.rows[0];
        game.black = blackRows.rows[0];
        client.end();
        res.json(game);
        return next();
    }
    catch (err) {
        console.log("Error occured while fetching data");
        client.end();
        res.json();
        return next();
    }
};

export const insertGame = (req: Request, res: Response, next: NextFunction) => {
    // TODO: insert game to DB ////////////////
    
    const body = req.body;
    const query = `
    INSERT INTO game VALUES(white, black, result) 
        (${body.white}, ${body.black}, ${body.result})
    `;
    
    try {
        // TODO: Query execution //
        
        ///////////////////////////
        res.send("Insert query executed successfully!");
    }
    catch {
        // TODO: Rollback //
        
        ////////////////////
        res.send("Error occured while inserting. Please try again.");
    }
    ///////////////////////////////////////////
    
    // TEST CODE //
    res.send("TEST: Insert query executed successfully!");
    return next();
};