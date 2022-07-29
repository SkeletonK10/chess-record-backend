import Router from 'express';
import { test, getPlayerView } from './api';

const router = Router();

router.get("/:id/", getPlayerView);

export default router;
