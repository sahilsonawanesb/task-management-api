import express from 'express';
import {authenticate} from '../middlewares/auth.js'
import { getMyNotifications, markAllNotificationAsRead, markNotificationAsRead } from '../controllers/notification.controller.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getMyNotifications);

router.patch('/:id/read', markNotificationAsRead);

router.patch('/read-all', markAllNotificationAsRead);


export default router;