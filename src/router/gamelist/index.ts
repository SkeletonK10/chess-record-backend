import Router from 'express';
import { test, getGameList } from './api';

const router = Router();

router.get("/", getGameList);

export default router;
