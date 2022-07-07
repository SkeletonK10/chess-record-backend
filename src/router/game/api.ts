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
    const gameRows = await client.query(gameQuery);
    let game = gameRows.rows[0];
    const whiteRows = await client.query(playerQuery(game.white));
    const blackRows = await client.query(playerQuery(game.black));
    game.white = whiteRows.rows[0];
    game.black = blackRows.rows[0];
    //////////////////////////////////////////
    
    // TEST DATA //
    
    // const game = 
    // {
    //     id: 3,
    //     createdAt: '2022-07-05',
    //     white: {
    //         id: 1,
    //         name: 'Gamer1',
    //         rating: 1000,
    //     },
    //     black: {
    //         id: 2,
    //         name: 'Gamer2',
    //         rating: 1050,
    //     },
    //     result: '1-0',
    //     notation: '1. e4 e5 2. Nf3 Nf6 1-0',
    // };

    // const row = rows.find(x => x.id === Number(req.params.id));
    ///////////////////////////////////////////
    res.json(game);
    return next();
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