import { Router } from 'express';
import { getMessages, postMessage } from '../controllers/message.controller';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', verifyToken, getMessages);
router.post('/', verifyToken, postMessage);

export default router;
