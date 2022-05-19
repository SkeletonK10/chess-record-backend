import express, { Request, Response, NextFunction } from 'express';
import router from "./router/root";

const app = express();

app.use("/", router);

app.listen("8000", () => {
    console.log("Server listening on port 8000");
});
