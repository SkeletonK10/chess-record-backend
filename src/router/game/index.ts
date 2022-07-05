import Router from 'express';
import { test, getGameList, getGameView, insertGame } from './api';

const router = Router();

router.get("/", getGameList);
router.post("/", insertGame);

router.get("/:id/", getGameView);

export default router;
