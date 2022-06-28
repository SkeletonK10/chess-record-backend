import Router from 'express';
import { welcome } from './api';
import game from './game';

const router = Router();

router.get("/", welcome);

router.use("/game/", game);

export default router;
