import { Request, Response, NextFunction } from "express";
import { getConnection } from "../../db";

export const test = (req: Request, res: Response, next: NextFunction) => {
    res.send("Hello, world!");
};

export const getGameList = async (req: Request, res: Response, next: NextFunction) => {
    
    // Production Code ///////////////////////
    
    // Test whether page parameter valid (Natural number)
    const valid: boolean = new RegExp(`^[1-9][0-9]*$`).test(req.params.page);
    
    const limit: number = 20;
    const page: number = valid ? Number(req.params.page) : 1;
    const offset: number = (page - 1) * limit;
    const query = `
    SELECT id, TO_CHAR(createdAt, 'YYYY-MM-DD') as createdAt, white, black, result, notation
        FROM game
        LIMIT ${limit}
        OFFSET ${offset}
    `;
    const client = await getConnection();
    const result = await client.query(query);
    const rows = result.rows;
    
    //////////////////////////////////////////
    
    // TEST DATA //
    // const rows =
    // [
    //     {
    //         id: 3,
    //         createdAt: new Date(Date.now()),
    //         white: 'Gamer1',
    //         black: 'Gamer2',
    //         result: '1-0'
    //     },
    // ]
    
    res.json(rows);
    return next();
};
