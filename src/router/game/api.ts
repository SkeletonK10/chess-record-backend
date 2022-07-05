import { Request, Response, NextFunction } from "express";

export const test = (req: Request, res: Response, next: NextFunction) => {
    res.send("Hello, world!");
};

export const getGameView = async (req: Request, res: Response, next: NextFunction) => {
    
    // TODO: get game from DB /////////////////
    // const limit: number = 20;
    // const query = `
    // SELECT id, white, black, result
    //     FROM game
    //     LIMIT ${limit}
    // `;
    // const client = await getConnection();
    // const result = await client.query(query);
    // const rows = result.rows;
    //////////////////////////////////////////
    
    // TEST DATA //
    
    const rows = [
        {
            id: 3,
            createdAt: '2022-07-05',
            white: {
                id: 1,
                name: 'Gamer1',
                rating: 1000,
            },
            black: {
                id: 2,
                name: 'Gamer2',
                rating: 1050,
            },
            result: '1-0',
            notation: '1. e4 e5 2. Nf3 Nf6 1-0',
        },
        {
            id: 6,
            createdAt: '2022-07-06',
            white: {
                id: 3,
                name: 'Gamer3',
                rating: 1000,
            },
            black: {
                id: 4,
                name: 'Gamer4',
                rating: 1050,
            },
            result: '1-0',
            notation: '1. e4 e5 2. Nf3 Nf6 1-0',
        }
    ]
    const row = rows.find(x => x.id === Number(req.params.id));
    res.json(row);
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