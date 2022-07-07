import { Request, Response, NextFunction } from "express";
import { getConnection } from "../../db";

export const test = (req: Request, res: Response, next: NextFunction) => {
    res.send("Hello, world!");
};

export const getGameList = async (req: Request, res: Response, next: NextFunction) => {
    
    // Production Code ///////////////////////
    
    const limit: number = 20;
    const rPage: number = Number(req.params.page)
    const page: number = Number.isInteger(rPage) ? Number(rPage) : 1;
    const offset: number = (page - 1) * limit;
    const query = `
    SELECT  G.id as id,
            TO_CHAR(G.createdAt, 'YYYY-MM-DD') as createdAt,
            W.name as white,
            B.name as black,
            G.result as result
    FROM    game as G
            JOIN
            player as W ON G.white = W.id
            JOIN
            player as B ON G.black = B.id
    ORDER BY id DESC
    LIMIT ${limit}
    OFFSET ${offset}
    `;
    const client = await getConnection();
    try {
        const result = await client.query(query);
        client.end();
        const rows = result.rows;
        res.json(rows);
        return next();
    } catch (err) {
        console.log("Error occured while fetching data");
        client.end();
        res.json();
        return next();
    }
};
