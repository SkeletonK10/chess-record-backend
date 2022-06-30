import Router from 'express';
import { test, getGameList, insertGame } from './api';

const router = Router();

router.get("/", getGameList);
router.post("/", insertGame);

export default router;
