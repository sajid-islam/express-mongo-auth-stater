import express from 'express';
import User from '../models/User.ts';
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

    const existingUser = await User.findOne({ userId: user.id });
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
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
