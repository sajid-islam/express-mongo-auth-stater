import express from 'express';
import {
  githubCallback,
  githubLogin,
  googleCallback,
  googleLogin,
  logout,
} from '../controllers/auth.controller.ts';
import isAuthenticated from '../middlewares/isAuthenticated.middleware.ts';
const router = express.Router();

router.get('/google', googleLogin);
router.get('/google/callback', googleCallback);
router.get('/github', githubLogin);
router.get('/github/callback', githubCallback);
router.post('/logout', isAuthenticated, logout);

export default router;
