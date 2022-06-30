import { Request, Response, NextFunction } from "express";
import { networkInterfaces } from "os";

export const test = (req: Request, res: Response, next: NextFunction) => {
    res.send("Hello, world!");
};

export const getGameList = (req: Request, res: Response, next: NextFunction) => {
    
    // TODO: get game from DB /////////////////
    const limit: number = 20;
    const query = `
    SELECT id, white, black, result
        FROM game
        LIMIT ${limit}
    `;
    // const rows = psql.query(query);
    //////////////////////////////////////////
    
    // TEST DATA //
    const rows =
    [
        {
            id: 3,
            white: 'Gamer1',
            black: 'Gamer2',
            result: '1-0'
        },
    ]
    
    res.json(rows);
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