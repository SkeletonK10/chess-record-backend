import Router from 'express';
import { welcome } from './api';
import game from './game';
import gamelist from './gamelist';
import player from './player';
import playerlist from './playerlist';

const router = Router();

router.get("/", welcome);

router.use("/game/", game);
router.use("/gamelist/", gamelist);
router.use("/player/", player);
router.use("/playerlist/", playerlist);

export default router;
