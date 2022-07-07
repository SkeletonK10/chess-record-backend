import Router from 'express';
import { test, getPlayer } from './api';

const router = Router();

router.get("/:id/", getPlayer);

export default router;
