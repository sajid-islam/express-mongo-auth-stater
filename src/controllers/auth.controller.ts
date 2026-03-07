import express from 'express';
import User from '../models/User.ts';
import {
  exchangeGithubCodeForTokens,
  fetchGithubUser,
  getGithubAuthUrl,
} from '../services/githubOAuth.services.ts';
import {
  exchangeCodeForTokens,
  fetchGoogleUser,
  getGoogleAuthUrl,
} from '../services/googleOAuth.services.ts';

export const googleLogin = (req: express.Request, res: express.Response) => {
  const url = getGoogleAuthUrl();
  res.redirect(url);
};

export const googleCallback = async (req: express.Request, res: express.Response) => {
  const code = req.query.code;
  if (typeof code !== 'string') {
    return res.status(400).json({ message: 'Invalid or Missing Code' });
  }
  try {
    const tokens = await exchangeCodeForTokens(code);
    const user = await fetchGoogleUser(tokens.access_token);

    const existingUser = await User.findOne({ email: user.email });
    if (existingUser && existingUser?.provider !== 'google') {
      return res.redirect(`${process.env.CLIENT_REDIRECT_URL}?error=provider_mismatch`);
    }
    if (!existingUser) {
      const newUser = new User({
        userId: user.id,
        name: user.name,
        email: user.email,
        photo_url: user.picture,
        provider: 'google',
        verified_email: user.verified_email,
      });
      await newUser.save();
    }

    req.session.userSession = { userId: user.id };
    req.session.save((err) => {
      if (err) {
        console.log('Session Error: ', err);
        res.status(500).json({ message: 'Session not saved, Try again' });
      }
      res.redirect(process.env.CLIENT_REDIRECT_URL!);
    });
  } catch (error) {
    console.log(error);
    return res.redirect(`${process.env.CLIENT_REDIRECT_URL}?error=google_login_failed`);
  }
};

export const githubLogin = async (req: express.Request, res: express.Response) => {
  try {
    const url = getGithubAuthUrl();
    res.redirect(url);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const githubCallback = async (req: express.Request, res: express.Response) => {
  try {
    const code = req.query.code;

    if (typeof code !== 'string') {
      return res.status(400).json({ message: 'Invalid or missing code' });
    }
    const tokens = await exchangeGithubCodeForTokens(code);
    const user = await fetchGithubUser(tokens.access_token);

    const existingUser = await User.findOne({ email: user.email });
    if (existingUser && existingUser?.provider !== 'github') {
      return res.redirect(`${process.env.CLIENT_REDIRECT_URL}?error=provider_mismatch`);
    }
    if (!existingUser) {
      const newUser = new User({
        userId: user.id,
        name: user.name,
        email: user.email,
        photo_url: user.avatar_url,
        provider: 'github',
        verified_email: true,
      });
      await newUser.save();
    }
    req.session.userSession = { userId: user.id };
    req.session.save((err) => {
      if (err) {
        console.log('Session Error: ', err);
        res.status(500).json({ message: 'Session not saved, Try again' });
      }

      res.redirect(process.env.CLIENT_REDIRECT_URL!);
    });
  } catch (error) {
    console.log('Error while github callback', error);
    return res.redirect(`${process.env.CLIENT_REDIRECT_URL}?error=github_login_failed`);
  }
};

export const logout = async (req: express.Request, res: express.Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.log('Error while logout user: ', err);
      res.status(500).json({ message: 'Failed to logout, try again' });
    }
    res.clearCookie('sid');
    return res.status(200).json({ message: 'Logout successfully!' });
  });
};
