import Router from 'express';
import { test, getGameView, insertGame } from './api';

const router = Router();

router.post("/", insertGame);
router.get("/:id/", getGameView);

export default router;
