import express from 'express';
import { getUser } from '../controllers/user.controller.ts';
import isAuthenticated from '../middlewares/isAuthenticated.middleware.ts';
const router = express.Router();

router.get('/profile', isAuthenticated, getUser);

export default router;
