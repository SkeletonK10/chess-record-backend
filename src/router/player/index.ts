import Router from 'express';
import { test, getPlayerView, insertPlayer } from './api';

const router = Router();

router.post("/", insertPlayer);
router.get("/:id/", getPlayerView);

export default router;
