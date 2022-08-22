import Router from 'express';
import { test, getGameView, insertGame, modifyGame } from './api';

const router = Router();

router.post("/", insertGame);
router.get("/:id/", getGameView);
router.put("/:id/", modifyGame);

export default router;
