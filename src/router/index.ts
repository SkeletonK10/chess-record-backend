import Router from 'express';
import { welcome } from './api';
import game from './game';
import gamelist from './gamelist';

const router = Router();

router.get("/", welcome);

router.use("/game/", game);
router.use("/gamelist/", gamelist);

export default router;
