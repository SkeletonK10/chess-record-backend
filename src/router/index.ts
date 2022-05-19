import Router from 'express';
import { test } from '../lib/api/root';
import game from './game';

const router = Router();

router.get("/", test);

router.use("/game/", game);

export default router;
