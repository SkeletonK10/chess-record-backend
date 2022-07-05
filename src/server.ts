import express from 'express';
import cors from 'cors';
import router from "./router";

const app = express();

const corsOptions = {
  origin: '*',
}
app.use(cors(corsOptions));

app.use("/", router);

export default app;